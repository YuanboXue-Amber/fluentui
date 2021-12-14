import * as React from 'react';
import { treeBehavior } from '@fluentui/accessibility';
import {
  useUnhandledProps,
  getElementType,
  useAccessibility,
  useStyles,
  useFluentContext,
} from '@fluentui/react-bindings';
import * as _ from 'lodash';
import { rtlTextContainer, TreeItem, Tree, TreeStylesProps, treeClassName } from '@fluentui/react-northstar';
import { TreeContext, TreeRenderContextValue } from '@fluentui/react-northstar/src/components/Tree/context';
import { VariableSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useVirtualStickyTree } from './useVirtualStickyTree';
import {
  VirtualStickyTreeProps,
  InnerElementContextType,
  VirtualItemData,
  InnerElementContext,
  OuterElementType,
  InnerElementType,
  ItemWrapper,
} from './VirtualStickyTree';

export interface VirtualStickyTreePaginationProps extends VirtualStickyTreeProps {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  isItemLoaded: (index: number) => boolean;
  onLoadNextPage: (startIndex: number, stopIndex: number) => Promise<void>;
  paginationThreshold?: number;
}

export const VirtualStickyTreePaginationClassName = 'ui-virtualstickytreepagination';

export type VirtualStickyTreePaginationHandle = {
  getItemRef: (id: string) => HTMLElement;
  visibleItemIds: string[];
};

export const VirtualStickyTreePagination = React.forwardRef<
  VirtualStickyTreePaginationHandle,
  VirtualStickyTreePaginationProps
>((props, ref) => {
  const context = useFluentContext();

  const {
    children,
    className,
    design,
    styles,
    variables,
    height,
    stickyItemSize,
    accessibility,
    renderItemTitle,
  } = props;

  const ElementType = getElementType(props);
  const unhandledProps = useUnhandledProps(
    [
      ...Tree.handledProps,
      'stickyItemSize',
      'itemSize',
      'itemToString',
      'hasNextPage',
      'isNextPageLoading',
      'isItemLoaded',
      'onLoadNextPage',
      'paginationThreshold',
    ],
    props,
  );

  const getA11yProps = useAccessibility(accessibility, {
    debugName: VirtualStickyTreePagination.displayName,
    rtl: context.rtl,
  });

  const { classes } = useStyles<TreeStylesProps>(Tree.displayName, {
    className: treeClassName,
    mapPropsToInlineStyles: () => ({
      className,
      design,
      styles,
      variables,
    }),
    rtl: context.rtl,
  });

  const {
    visibleItemIds,
    getItemById,
    registerItemRef,
    focusItemById,
    toggleItemActive,
    expandSiblings,
    listRef,
    getToFocusIDByFirstCharacter,
    getItemSize,
    stable_stickyItemIds,
    stickyItemPusherHeights,
    getItemOverrideProps,
    getItemRef,
  } = useVirtualStickyTree(props);

  React.useImperativeHandle(ref, () => ({ getItemRef, visibleItemIds }), [getItemRef, visibleItemIds]);

  const contextValue: TreeRenderContextValue = React.useMemo(
    () => ({
      getItemById,
      registerItemRef,
      toggleItemActive,
      focusItemById,
      expandSiblings,
      toggleItemSelect: _.noop,
      getToFocusIDByFirstCharacter,
    }),
    [getItemById, registerItemRef, toggleItemActive, focusItemById, expandSiblings, getToFocusIDByFirstCharacter],
  );

  const createTreeItem = React.useCallback(
    (id, style) => {
      const item = getItemById(id);
      if (!item) {
        return null;
      }
      const overrideProps = getItemOverrideProps(id, style);
      return TreeItem.create(item.item, {
        defaultProps: () =>
          getA11yProps('item', {
            renderItemTitle,
          }),
        overrideProps,
      });
    },
    [getA11yProps, getItemById, getItemOverrideProps, renderItemTitle],
  );

  const innerElementContextValue: InnerElementContextType = React.useMemo(
    () => ({
      getItemById,
      stickyItemIds: stable_stickyItemIds,
      stickyItemPusherHeights,
      stickyItemSize,
      createTreeItem,
    }),
    [getItemById, stable_stickyItemIds, stickyItemPusherHeights, stickyItemSize, createTreeItem],
  );

  const getItemKey = React.useCallback((index: number, data: VirtualItemData) => data.visibleItemIds[index], []);

  const { hasNextPage, isNextPageLoading, isItemLoaded, onLoadNextPage, paginationThreshold } = props;

  const itemCount = hasNextPage ? visibleItemIds.length + 1 : visibleItemIds.length;

  const loadMoreItems = React.useCallback(
    (startIndex: number, stopIndex: number) => {
      const indexBeforeNextPage = visibleItemIds.length;
      if (isNextPageLoading) {
        return Promise.resolve();
      }
      return onLoadNextPage(startIndex, stopIndex).then(() => {
        if (listRef.current) {
          listRef.current.resetAfterIndex(indexBeforeNextPage, true);
        }
      });
    },
    [visibleItemIds.length, isNextPageLoading, onLoadNextPage, listRef],
  );

  const element = (
    <TreeContext.Provider value={contextValue}>
      {getA11yProps.unstable_wrapWithFocusZone(
        <ElementType
          {...getA11yProps('root', {
            className: classes.root,
            ref,
            ...rtlTextContainer.getAttributes({ forElements: [children] }),
            ...unhandledProps,
          })}
        >
          <InnerElementContext.Provider value={innerElementContextValue}>
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
              threshold={paginationThreshold}
            >
              {({ onItemsRendered, ref }) => (
                <VariableSizeList
                  width={-1} // width is not used for vertical list
                  ref={listRef}
                  height={height}
                  itemSize={getItemSize}
                  itemKey={getItemKey}
                  itemData={{ visibleItemIds, createTreeItem }}
                  itemCount={itemCount}
                  outerElementType={OuterElementType}
                  innerElementType={InnerElementType}
                  innerRef={ref}
                  onItemsRendered={onItemsRendered}
                >
                  {ItemWrapper}
                </VariableSizeList>
              )}
            </InfiniteLoader>
          </InnerElementContext.Provider>
        </ElementType>,
      )}
    </TreeContext.Provider>
  );
  return element;
});

VirtualStickyTreePagination.displayName = 'VirtualStickyTreePagination';

VirtualStickyTreePagination.defaultProps = {
  accessibility: treeBehavior,
  itemSize: 50,
  paginationThreshold: 15,
};
