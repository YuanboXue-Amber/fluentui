import * as React from 'react';
import { getNativeElementProps, useControllableState, useEventCallback } from '@fluentui/react-utilities';
import type { TagGroupProps, TagGroupState } from './TagGroup.types';

/**
 * Create the state required to render TagGroup.
 *
 * The returned state can be modified with hooks such as useTagGroupStyles_unstable,
 * before being passed to renderTagGroup_unstable.
 *
 * @param props - props from this instance of TagGroup
 * @param ref - reference to root HTMLElement of TagGroup
 */
export const useTagGroup_unstable = (props: TagGroupProps, ref: React.Ref<HTMLElement>): TagGroupState => {
  const [checkedItems, setCheckedItems] = useControllableState({
    state: props.checkedItems ?? undefined,
    defaultState: props.defaultCheckedItems,
    initialState: [],
  });

  const toggleCheckedItems = useEventCallback(
    (e: React.MouseEvent | React.KeyboardEvent, id: string, checked: boolean) => {
      const newCheckedItems = [...checkedItems];
      if (checked) {
        newCheckedItems.splice(newCheckedItems.indexOf(id), 1);
      } else {
        newCheckedItems.push(id);
      }

      props.onCheckedItemsChange?.(e, { checkedItems: newCheckedItems });
      setCheckedItems(newCheckedItems);
    },
  );

  return {
    components: {
      root: 'div',
    },
    root: getNativeElementProps('div', {
      ref,
      // TODO aria attributes
      ...props,
    }),
    checkedItems,
    toggleCheckedItems,
  };
};
