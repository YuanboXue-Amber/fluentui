/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */
import * as React from 'react';
import {
  FlatTreeProps,
  TreeItemLayout,
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

type ItemProps = HeadlessFlatTreeItemProps;

const defaultItems: ItemProps[] = [
  {
    value: 'flatTreeItem_lvl-1_item-1',
    children: <TreeItemLayout>Level 1, item 1</TreeItemLayout>,
  },
  ...Array.from({ length: 300 }, (_, i) => ({
    value: `flatTreeItem_lvl-1_item-1--child:${i}`,
    parentValue: 'flatTreeItem_lvl-1_item-1',
    children: <TreeItemLayout>Item {i + 1}</TreeItemLayout>,
  })),
  {
    value: 'flatTreeItem_lvl-1_item-2',
    children: <TreeItemLayout>Level 1, item 2</TreeItemLayout>,
  },
  ...Array.from({ length: 300 }, (_, index) => ({
    value: `flatTreeItem_lvl-1_item-2--child:${index}`,
    parentValue: 'flatTreeItem_lvl-1_item-2',
    children: <TreeItemLayout>Item {index + 1}</TreeItemLayout>,
  })),
];

export const FlatVirtualizedTreeItem: ForwardRefComponent<
  FlatTreeItemProps & { virtualItemProps: Pick<VirtualItem, 'size' | 'start'> }
> = React.forwardRef(({ virtualItemProps, ...props }, ref) => {
  const state = useTreeItem_unstable(props, ref);

  // TODO makeStyle the static styles
  state.root.style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: `${virtualItemProps.size}px`,
    transform: `translateY(${virtualItemProps.start}px)`,
    ...state.root.style,
  };

  useTreeItemStyles_unstable(state);
  const contextValues = useTreeItemContextValues_unstable(state);
  return renderTreeItem_unstable(state, contextValues);
});

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

export function useHeadlessFlatVirtualizedTree_unstable<Props extends HeadlessFlatTreeItemProps>(
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

/**
 * Why useHeadlessFlatVirtualizedTree instead of component:
 * Virtualization needs a ref to the scroll container to calculate the visible items. If we were to use a component, it is not a good design to have either Tree or container as root ref. Either way, one of them can only be customized via object props.
 *   - If we were to use Tree as root ref, container as a slot <Tree container={{style: {overflow: 'auto}}}, it is strange because container is parent of Tree..
 *   - If we were to use container as root ref, Tree as a slot, we need to have either Tree accepting object prop, or set Tree as primary slot, which will accepts the component props instead of container. It is confusing.
 * The best way is simply let user define the container element. All we need is a ref to it.
 */
const estimateSize = () => 35;
export const Default = () => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const headlessTree = useHeadlessFlatVirtualizedTree_unstable(defaultItems, {
    virtualizerOptions: {
      estimateSize,
      getScrollElement: () => parentRef.current,
    },
  });

  const virtualItems = headlessTree.getVirtualItems();

  return (
    <div ref={parentRef} style={{ height: '50vh', overflow: 'auto' }}>
      {/* An empty Tree that has no children on 1st render won't have keyboard navigation initialized. */}
      {virtualItems.length && (
        <FlatVirtualizedTree
          {...headlessTree.getTreeProps()}
          aria-label="Flat Virtualized Tree"
          style={{ height: `${headlessTree.getTotalSize()}px` }}
        >
          {virtualItems.map(flatTreeItem => {
            const { getTreeItemProps, virtualItemProps } = flatTreeItem;
            const treeItemProps = getTreeItemProps();
            return (
              <FlatVirtualizedTreeItem
                key={treeItemProps.value}
                virtualItemProps={virtualItemProps}
                {...treeItemProps}
              />
            );
          })}
        </FlatVirtualizedTree>
      )}
    </div>
  );
};
