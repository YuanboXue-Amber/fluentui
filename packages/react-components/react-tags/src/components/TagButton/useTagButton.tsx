import * as React from 'react';
import { resolveShorthand, useId } from '@fluentui/react-utilities';
import type { TagButtonProps, TagButtonState } from './TagButton.types';
import { useTag_unstable } from '../Tag/index';
import { useTagGroupContext_unstable } from '../../contexts/TagGroupContext';
import type { ARIAButtonElement, ARIAButtonElementIntersection } from '@fluentui/react-aria';

/**
 * Create the state required to render TagButton.
 *
 * The returned state can be modified with hooks such as useTagButtonStyles_unstable,
 * before being passed to renderTagButton_unstable.
 *
 * @param props - props from this instance of TagButton
 * @param ref - reference to root HTMLElement of TagButton
 */
export const useTagButton_unstable = (
  props: TagButtonProps,
  ref: React.Ref<ARIAButtonElement<'div'>>,
): TagButtonState => {
  const toggleCheckedItems = useTagGroupContext_unstable(context => context.toggleCheckedItems);

  const id = useId('fui-TagButton-', props.id);

  const contextChecked = useTagGroupContext_unstable(context => {
    const checkedItems = context.checkedItems || [];
    return checkedItems.indexOf(id) !== -1;
  });
  const { checked = contextChecked } = props;

  // TODO to select on keydown, useARIAButtonShorthand, but that would mean content is 'button' and we'll have trouble re-use useTag hook
  const content = resolveShorthand(props.content, {
    required: true,
    defaultProps: {
      tabIndex: 0,
      'aria-checked': checked,
      // TODO aria attributes
      onClick: (e: React.MouseEvent<ARIAButtonElementIntersection<'div'>>) => {
        toggleCheckedItems?.(e, id, checked);
        props.onClick?.(e);
      },
    },
  });

  return useTag_unstable({ ...props, content, checked }, ref);
};
