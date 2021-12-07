import * as React from 'react';
import { UseVirtualTreeOptions, UseVirtualTreeResult, useVirtualTree, TreeItemProps } from '@fluentui/react-northstar';
import { VariableSizeListProps } from 'react-window';

export interface UseVirtualTreeStickyOptions extends UseVirtualTreeOptions, Pick<VariableSizeListProps, 'height'> {
  /** height of a non-sticky tree item */
  itemSize: number;
  /** height of 1st level sticky tree item */
  stickyItemSize: number;
}

export interface TreeItemOverrideProps
  extends Pick<TreeItemProps, 'expanded' | 'parent' | 'level' | 'index' | 'treeSize' | 'selectable'> {
  key: string;
  style: React.CSSProperties;
  onFocus: (e: React.FocusEvent<Element>) => void;
  onKeyDown: (e: React.KeyboardEvent<Element>) => void;
}

export interface UseVirtualTreeStickyResult extends UseVirtualTreeResult {
  /** an array of sticky item ids. This array is stable, and can be used as dependencies */
  stable_stickyItemIds: string[];

  /** height of the pusher under each sticky item. Virtualized sticky tree uses these pusher DOM elements to make sure sticky items are rendered correctly */
  stickyItemPusherHeights: number[];

  /** return a function that is compatible with react-window variable sized list's `itemSize` prop */
  getItemSize: (index: number) => number;

  /** return override props that is useful when creating tree items in virtualized sticky tree */
  getItemOverrideProps: (id: string, reactWindowStyle: React.CSSProperties) => TreeItemOverrideProps;
}

export function useVirtualStickyTree(props: UseVirtualTreeStickyOptions): UseVirtualTreeStickyResult {
  const { items, defaultActiveItemIds, height, itemSize, stickyItemSize } = props;

  const stickyItemIds = React.useMemo(() => items.map(item => item.id) || [], [items]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stable_stickyItemIds = React.useMemo(() => stickyItemIds, [stickyItemIds.join()]);

  const baseTree = useVirtualTree({
    ...props,
    defaultActiveItemIds: defaultActiveItemIds || stable_stickyItemIds,
  });
  const {
    visibleItemIds,
    activeItemIds,
    getItemById,
    focusItemById: baseFocusItemById,
    toggleItemActive: baseToggleItemActive,
    listRef,
    getItemRef,
  } = baseTree;

  const scrollToMakeItemVisible = React.useCallback(
    itemOffset => {
      const _2 = 2;
      const scrollOffset = Math.max(0, itemOffset - (height as number) / _2); // try to position item in the middle of container
      listRef.current.scrollTo(scrollOffset);
    },
    [height, listRef],
  );

  const getItemSize = React.useCallback(
    (index: number) => {
      const id = visibleItemIds[index];

      const item = getItemById(id);
      if (item.level === 1) {
        return stickyItemSize;
      }
      return itemSize;
    },
    [getItemById, itemSize, stickyItemSize, visibleItemIds],
  );

  const focusItemById = React.useCallback(
    (id: string) => {
      baseFocusItemById(id);

      // item is not mounted yet, scroll to make item visible
      if (getItemRef(id) == null) {
        const getItemOffset = (index: number) => {
          let result = 0;
          for (let i = 0; i < index; ++i) {
            result += getItemSize(i);
          }
          return result;
        };
        const focusIndex = visibleItemIds.indexOf(id);
        scrollToMakeItemVisible(getItemOffset(focusIndex));
      }
    },
    [baseFocusItemById, getItemRef, getItemSize, scrollToMakeItemVisible, visibleItemIds],
  );

  // get height of the pusher for each sticky item, based on number of their visible descendants
  const stickyItemPusherHeights: number[] = React.useMemo(() => {
    const result = new Array(stable_stickyItemIds.length).fill(0);

    let stickyIndex = 0;
    visibleItemIds.forEach(id => {
      if (id === stable_stickyItemIds[stickyIndex]) {
        stickyIndex++;
      } else {
        result[stickyIndex - 1] += itemSize;
      }
    });
    return result;
  }, [itemSize, stable_stickyItemIds, visibleItemIds]);

  const toggleItemActive = React.useCallback(
    (e: React.SyntheticEvent, idToToggle: string) => {
      if (getItemById(idToToggle).level === 1 && !activeItemIds.includes(idToToggle)) {
        // item is sticky and is to be expanded, scroll as if this item is sticked to top
        let i = 0;
        let scrollOffset = 0;
        while (idToToggle !== stable_stickyItemIds[i]) {
          scrollOffset += stickyItemPusherHeights[i];
          i++;
        }
        listRef.current.scrollTo(scrollOffset);
      }

      baseToggleItemActive(e, idToToggle);
    },
    [activeItemIds, baseToggleItemActive, getItemById, listRef, stable_stickyItemIds, stickyItemPusherHeights],
  );

  // When using keyboard, and navigate to non-sticky items, they could be hidden behind sticky headers.
  // Scroll to make the focused non-sticky items always visible
  const handleItemFocus = React.useCallback(
    (e: React.FocusEvent) => {
      const treeItemDOM = e.currentTarget;
      const id = treeItemDOM.id;
      const item = getItemById(id);

      if (!item || item.level === 1) {
        return; // focused sticky items are always visible, so no need to deal with them
      }

      const isOverlappingWithSticky = () => {
        const overlap = (rect1: DOMRect, rect2: DOMRect) => !(rect1.bottom <= rect2.top || rect1.top >= rect2.bottom);

        const boundary = treeItemDOM.getBoundingClientRect();
        for (const stickyId of stable_stickyItemIds) {
          if (overlap(boundary, getItemRef(stickyId).getBoundingClientRect())) {
            return true;
          }
        }
        return false;
      };

      if (isOverlappingWithSticky()) {
        if (item.childrenIds && item.childrenIds.length) {
          // when tree item is not leaf, focus is on tree item itself
          scrollToMakeItemVisible((treeItemDOM as HTMLElement).offsetTop);
        } else if (treeItemDOM.parentElement) {
          // when tree item is leaf, focus is on tree title. Tree title's parentElement is tree item
          scrollToMakeItemVisible((treeItemDOM.parentElement as HTMLElement).offsetTop);
        }
      }
    },
    [getItemById, getItemRef, stable_stickyItemIds, scrollToMakeItemVisible],
  );

  // When using keyboard, and navigate to stickyItems, arrow up/down should navigate to previous item's last child/current Item's first child.
  // But because of virtualization, the destination item is not always rendered, so we scroll to them to force rendering
  const handleArrowUpDownOnSticky = React.useCallback(
    (stickyId, stickyItem) => (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusItemById(stickyItem.childrenIds[0]);
      }
      if (e.key === 'ArrowUp' && stickyItem.index !== 1) {
        const indexAmongVisible = visibleItemIds.indexOf(stickyId);
        if (indexAmongVisible > 0) {
          e.preventDefault();
          focusItemById(visibleItemIds[indexAmongVisible - 1]);
        }
      }
    },
    [focusItemById, visibleItemIds],
  );

  const getItemOverrideProps = React.useCallback(
    (id: string, reactWindowStyle: React.CSSProperties) => {
      const item = getItemById(id);
      const { expanded, parent, level, index, treeSize, childrenIds } = item;
      return {
        style: reactWindowStyle,
        expanded,
        parent,
        key: id,
        level,
        index,
        treeSize,
        selectable: false,
        onFocus: handleItemFocus,
        ...(level === 1 &&
          expanded &&
          childrenIds &&
          childrenIds.length && {
            onKeyDown: handleArrowUpDownOnSticky(id, item),
          }),
      };
    },
    [getItemById, handleArrowUpDownOnSticky, handleItemFocus],
  );

  React.useLayoutEffect(() => {
    listRef.current.resetAfterIndex(0);
  }, [listRef, visibleItemIds]); // when item collapsed/expanded (visibleItemIds change), refresh react-window itemSize cache

  return {
    ...baseTree,
    focusItemById,
    toggleItemActive,
    // below are specially for sticky tree
    stable_stickyItemIds,
    stickyItemPusherHeights,
    getItemSize,
    getItemOverrideProps,
  };
}
