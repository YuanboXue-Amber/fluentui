import * as React from 'react';
import { getNativeElementProps, useEventCallback } from '@fluentui/react-utilities';
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
  const { children, onDismiss, items = [], size = 'medium' } = props;

  const handleTagDismiss = useEventCallback((e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    // TODO think about selection and delete tag in bulk, can user do that?
    onDismiss?.(e, { dismissedTagId: id });

    // TODO set focus after tag dismiss
  });

  return {
    handleTagDismiss,
    items,
    size,

    components: {
      root: 'div',
    },

    root: getNativeElementProps('div', {
      ref,
      ...props,
      children: typeof children === 'function' ? items.map(item => children(item)) : children,
      // TODO aria attributes
    }),
  };
};
