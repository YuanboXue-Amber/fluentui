import * as React from 'react';
import { useAutoControlled } from '@fluentui/react-bindings';
import { UseTreeOptions } from './useTree';
import { useStableProps } from './useStableProps';
import { BaseFlatTreeItem } from './flattenTree';
import * as _ from 'lodash';

export interface UseTreeActiveStateResult {
  activeItemIds: string[];
  toggleItemActive: (e: React.SyntheticEvent, idToToggle: string) => void;
  expandSiblings: (e: React.KeyboardEvent, focusedItemId: string) => void;
}

export function useTreeActiveState(
  options: Pick<UseTreeOptions, 'defaultActiveItemIds' | 'activeItemIds' | 'exclusive'>,
  getItemById: (id: string) => BaseFlatTreeItem,
  deprecated_initialActiveItemIds: string[],
): UseTreeActiveStateResult {
  const [activeItemIds, setActiveItemIdsState] = useAutoControlled<string[]>({
    defaultValue: options.defaultActiveItemIds,
    value: options.activeItemIds,
    initialValue: deprecated_initialActiveItemIds, // will become []
  });

  const stableProps = useStableProps(options);

  const toggleItemActive = React.useCallback(
    (e: React.SyntheticEvent, idToToggle: string) => {
      const item = getItemById(idToToggle);
      if (!item || !item.hasSubtree) {
        // leaf node does not have the concept of active/inactive
        return;
      }

      setActiveItemIdsState(activeItemIds => {
        let nextActiveItemIds: string[];
        const isActiveId = activeItemIds.indexOf(idToToggle) !== -1;

        if (isActiveId) {
          nextActiveItemIds = _.without(activeItemIds, idToToggle);
        } else if (options.exclusive) {
          // need to collapse everything else, except id and its ancestors
          const ancestors = getAncestorsIds(getItemById, item);
          nextActiveItemIds = [...ancestors, idToToggle];
        } else {
          nextActiveItemIds = [...activeItemIds, idToToggle];
        }

        _.invoke(stableProps.current, 'onActiveItemIdsChange', e, {
          ...stableProps.current,
          activeItemIds: nextActiveItemIds,
        });

        return nextActiveItemIds;
      });
    },
    [getItemById, options.exclusive, setActiveItemIdsState, stableProps],
  );

  const expandSiblings = React.useCallback(
    (e: React.KeyboardEvent, focusedItemId: string) => {
      const focusedItem = getItemById(focusedItemId);
      if (!focusedItem) {
        return;
      }

      const parentItem = getItemById(focusedItem?.parent);
      const siblingsIds = _.without(parentItem?.childrenIds || [], focusedItemId);

      if (!siblingsIds) {
        return;
      }

      setActiveItemIdsState(activeItemIds => {
        const nextActiveItemIds = _.uniq(activeItemIds.concat(siblingsIds));
        _.invoke(stableProps.current, 'onActiveItemIdsChange', e, {
          ...stableProps.current,
          activeItemIds: nextActiveItemIds,
        });
        return nextActiveItemIds;
      });
    },
    [getItemById, setActiveItemIdsState, stableProps],
  );

  return {
    activeItemIds,
    toggleItemActive,
    expandSiblings,
  };
}

function getAncestorsIds(getItemById: (id: string) => BaseFlatTreeItem, item: BaseFlatTreeItem): string[] {
  const result = [];
  let parent = item?.parent;
  while (parent && getItemById(parent)?.level >= 1) {
    result.push(parent);
    parent = getItemById(parent)?.parent;
  }
  return result;
}
