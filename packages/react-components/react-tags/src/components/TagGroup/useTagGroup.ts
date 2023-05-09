import * as React from 'react';
import { getNativeElementProps, useEventCallback, useMergedRefs } from '@fluentui/react-utilities';
import type { TagGroupProps, TagGroupState } from './TagGroup.types';
import { useFocusFinders } from '@fluentui/react-tabster';

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
  const { findLastFocusable } = useFocusFinders();
  const innerRef = React.useRef<HTMLDivElement>(null);

  const handleTagDismiss = useEventCallback(() => {
    // TODO: what if the last tag is interactive? do we focus on the tag content or the dismiss button
    findLastFocusable(innerRef.current as HTMLElement)?.focus();
  });

  return {
    components: {
      root: 'div',
    },
    root: getNativeElementProps('div', {
      ref: useMergedRefs(ref, innerRef),
      // TODO aria attributes
      ...props,
    }),
    handleTagDismiss,
  };
};
