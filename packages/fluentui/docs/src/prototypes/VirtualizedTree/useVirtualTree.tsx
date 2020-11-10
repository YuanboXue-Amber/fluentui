import * as React from 'react';
import { useTree, UseTreeOptions } from '@fluentui/react-northstar/src/components/Tree/hooks/useTree';

export function useVirtualTree(props: UseTreeOptions) {
  const baseTree = useTree(props);
  const {
    registerItemRef: baseRegisterItemRef,
    siblingsExpand: baseSiblingsExpand,
    getItemById,
    visibleItemIds,
  } = baseTree;

  const listRef = React.useRef();
  const [focusId, setFocusId] = React.useState(null);
  const stableSetFocusId = React.useCallback(id => setFocusId(id), []);
  const removeFocusId = React.useCallback(() => setFocusId(null), []);

  const registerItemRef = React.useCallback(
    (id: string, node: HTMLElement) => {
      baseRegisterItemRef(id, node);
      if (node && focusId === id) {
        node.focus();
        if (getItemById(id)?.hasSubtree) {
          node.focus();
        } else {
          // when node is leaf, need to focus on the inner treeTitle
          (node?.firstElementChild as HTMLElement)?.focus();
        }
        removeFocusId();
      }
    },
    [baseRegisterItemRef, focusId, getItemById, removeFocusId],
  );

  const focusParent = React.useCallback(
    (parent: string) => {
      stableSetFocusId(parent);
    },
    [stableSetFocusId],
  );

  const focusFirstChild = React.useCallback(
    (id: string) => {
      const firstChild = getItemById(id)?.childrenIds?.[0];
      if (!firstChild) {
        return;
      }
      stableSetFocusId(firstChild);
    },
    [getItemById, stableSetFocusId],
  );

  const siblingsExpand = React.useCallback(
    (e: React.KeyboardEvent, id: string) => {
      baseSiblingsExpand(e, id);
      stableSetFocusId(id);
    },
    [baseSiblingsExpand, stableSetFocusId],
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
    if (focusId != null) {
      const focusIndex = visibleItemIds.indexOf(focusId);
      if (focusIndex >= 0) {
        (listRef.current as any)?.scrollToItem(focusIndex, 'center');
      }
    }
  }, [visibleItemIds, focusId]);

  return {
    ...baseTree,
    registerItemRef,
    focusParent,
    focusFirstChild,
    siblingsExpand,
    listRef,
  };
}
