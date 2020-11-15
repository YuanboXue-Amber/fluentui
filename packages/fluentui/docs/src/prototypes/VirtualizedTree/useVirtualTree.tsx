import * as React from 'react';
import { useTree, UseTreeOptions } from '@fluentui/react-northstar/src/components/Tree/hooks/useTree';

export function useVirtualTree(props: UseTreeOptions) {
  const baseTree = useTree(props);
  const {
    registerItemRef: baseRegisterItemRef,
    expandSiblings: baseExpandSiblings,
    getItemById,
    getItemRef,
    visibleItemIds,
  } = baseTree;

  const listRef = React.useRef();
  const focusIdRef = React.useRef<string>();

  const focusItemById = React.useCallback(
    (id: string) => {
      if (id == null) {
        return;
      }

      const itemRef = getItemRef(id);

      // item is not mounted yet
      if (itemRef == null) {
        // set focusIdRef so item can be focused on mount; scroll to item
        focusIdRef.current = id;
        const focusIndex = visibleItemIds.indexOf(focusIdRef.current);
        if (focusIndex >= 0) {
          (listRef.current as any)?.scrollToItem(focusIndex, 'center');
        }
        return;
      }

      // item is mounted, set focus
      if (getItemById(id)?.hasSubtree) {
        itemRef.focus();
      } else {
        // when node is leaf, need to focus on the inner treeTitle
        (itemRef.firstElementChild as HTMLElement)?.focus();
      }
    },
    [getItemById, getItemRef, visibleItemIds],
  );

  const registerItemRef = React.useCallback(
    (id: string, node: HTMLElement) => {
      baseRegisterItemRef(id, node);
      if (node && focusIdRef.current === id) {
        focusItemById(id);
        focusIdRef.current = null;
      }
    },
    [baseRegisterItemRef, focusItemById],
  );

  const expandSiblings = React.useCallback(
    (e: React.KeyboardEvent, id: string) => {
      baseExpandSiblings(e, id);
      focusIdRef.current = id;
    },
    [baseExpandSiblings],
  );

  React.useLayoutEffect(() => {
    /**
     * Reason for scroll in useLayoutEffect:
     * Without useLayoutEffect, scrolling works for focus parent and focus first child, but it is problematic for expanding sibings.
     * When focus parent/child, the number of items (itemCount) in the virtual list does not change. But when sibling expand, itemCount could change.
     * When siblings are expanded:
     *  without useLayoutEffect, react window uses the itemCount before siblings are expanded, causing it to compute wrong scroll offset.
     *  with useLayoutEffect, the scrolling happens after the new itemCount passed into list as props. Therefore the computed scroll offset is correct.
     */
    if (focusIdRef.current != null && getItemRef(focusIdRef.current) == null) {
      const focusIndex = visibleItemIds.indexOf(focusIdRef.current);
      if (focusIndex >= 0) {
        (listRef.current as any)?.scrollToItem(focusIndex, 'center');
      }
    }
  }, [getItemRef, visibleItemIds]);

  return {
    ...baseTree,
    registerItemRef,
    focusItemById,
    expandSiblings,
    listRef,
  };
}
