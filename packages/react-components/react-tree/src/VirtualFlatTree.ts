import * as React from 'react';
import {
  FlatTreeProps,
  TreeNavigationData_unstable,
  TreeNavigationEvent_unstable,
  useFlatTree_unstable,
  HeadlessFlatTreeItemProps,
  useFlatTreeStyles_unstable,
  useFlatTreeContextValues_unstable,
  HeadlessFlatTreeItem,
  useHeadlessFlatTree_unstable,
  HeadlessFlatTreeOptions,
  HeadlessFlatTree,
  FlatTreeItemProps,
  useTreeItem_unstable,
  renderTreeItem_unstable,
  useTreeItemContextValues_unstable,
  useTreeItemStyles_unstable,
  renderFlatTree_unstable,
  useEventCallback,
} from '@fluentui/react-components';
import { ForwardRefComponent } from '@fluentui/react-components';
import { VirtualItem, useVirtualizer } from '@tanstack/react-virtual';

export type FlatVirtualizedTreeItemProps = FlatTreeItemProps & {
  // TODO better naming for virtualItemProps?
  virtualItemProps: Pick<VirtualItem, 'size' | 'start'>;
};

/**
 * fluent FlatTreeItem with some preset styles for virtualization
 */
export const FlatVirtualizedTreeItem: ForwardRefComponent<FlatVirtualizedTreeItemProps> = React.forwardRef(
  ({ virtualItemProps, ...props }, ref) => {
    const state = useTreeItem_unstable(props, ref);

    // TODO makeStyle the static styles
    state.root.style = {
      position: 'absolute',
      top: `${virtualItemProps.start}px`,
      left: 0,
      width: '100%',
      height: `${virtualItemProps.size}px`,
      // transform: `translateY(${virtualItemProps.start}px)`,
      ...state.root.style,
    };

    useTreeItemStyles_unstable(state);
    const contextValues = useTreeItemContextValues_unstable(state);
    return renderTreeItem_unstable(state, contextValues);
  },
);

/**
 * fluent FlatTree with some preset styles for virtualization
 */
export const FlatVirtualizedTree: ForwardRefComponent<FlatTreeProps> = React.forwardRef((props, ref) => {
  const state = useFlatTree_unstable(props, ref);

  // TODO makeStyle the static styles
  state.root.style = {
    width: '100%',
    position: 'relative',
    ...state.root.style,
  };

  const contextValues = useFlatTreeContextValues_unstable(state);
  useFlatTreeStyles_unstable(state);

  return renderFlatTree_unstable(state, contextValues);
});

/**
 * A hook built on top of Fluent UI `useHeadlessFlatTree_unstable`.
 *
 * It passes all visible items to tanStack `useVirtualizer`, and returns only the items that needs to be rendered.
 *
 * It's usage is similar to `useHeadlessFlatTree_unstable`, with an extra `virtualizerOptions`.
 */
export function useHeadlessFlatVirtualizedTree<Props extends HeadlessFlatTreeItemProps>(
  props: Props[],
  {
    virtualizerOptions,
    ...options
  }: HeadlessFlatTreeOptions & {
    virtualizerOptions: Omit<Parameters<typeof useVirtualizer>[0], 'count'>;
  },
): HeadlessFlatTree<Props> &
  Omit<ReturnType<typeof useVirtualizer>, 'getVirtualItems'> & {
    getVirtualItems: () => (HeadlessFlatTreeItem<Props> & {
      virtualItemProps: Pick<VirtualItem, 'size' | 'start'>;
    })[];
  } {
  const headlessTree = useHeadlessFlatTree_unstable(props, options);

  const items = React.useMemo(() => Array.from(headlessTree.items()), [headlessTree]);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    ...virtualizerOptions,
  });

  const baseGetVirtualItems = rowVirtualizer.getVirtualItems;
  const getVirtualItems = React.useCallback(
    () =>
      baseGetVirtualItems().map(virtualItem => ({
        virtualItemProps: { size: virtualItem.size, start: virtualItem.start },
        ...items[virtualItem.index],
      })),
    [baseGetVirtualItems, items],
  );

  /**
   * Since navigation is not possible due to the fact that not all items are rendered,
   * we need to scroll to the next item and then invoke navigation.
   */
  const handleNavigation = useEventCallback(
    (event: TreeNavigationEvent_unstable, data: TreeNavigationData_unstable) => {
      const nextItem = headlessTree.getNextNavigableItem(items, data);
      if (!nextItem) {
        return;
      }
      // if the next item is not rendered, scroll to it and try to navigate again
      if (!headlessTree.getElementFromItem(nextItem)) {
        event.preventDefault(); // preventing default disables internal navigation.
        rowVirtualizer.scrollToIndex(nextItem.index);
        // waiting for the next animation frame to allow the list to be scrolled
        return requestAnimationFrame(() => headlessTree.navigate(data));
      }
    },
  );

  const baseGetTreeProps = headlessTree.getTreeProps;
  const getTreeProps = React.useCallback(
    () => ({
      ...baseGetTreeProps(),
      onNavigation: handleNavigation,
    }),
    [baseGetTreeProps, handleNavigation],
  );

  return {
    ...headlessTree,
    getTreeProps,
    ...rowVirtualizer,
    getVirtualItems,
  };
}
