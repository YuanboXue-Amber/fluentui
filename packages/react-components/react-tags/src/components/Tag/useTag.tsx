import * as React from 'react';
import { getNativeElementProps, useEventCallback } from '@fluentui/react-utilities';
import { DismissRegular, bundleIcon, DismissFilled } from '@fluentui/react-icons';
import type { TagProps, TagState } from './Tag.types';
import { useARIAButtonShorthand } from '@fluentui/react-aria';
import { Delete, Backspace } from '@fluentui/keyboard-keys';
import { useTagGroupContext_unstable } from '../../contexts/TagGroupContext';

const DismissIcon = bundleIcon(DismissFilled, DismissRegular);

/**
 * Create the state required to render Tag.
 *
 * The returned state can be modified with hooks such as useTagStyles_unstable,
 * before being passed to renderTag_unstable.
 *
 * @param props - props from this instance of Tag
 * @param ref - reference to root HTMLElement of Tag
 */
export const useTag_unstable = (props: TagProps, ref: React.Ref<HTMLElement>): TagState => {
  const handleTagDismiss = useTagGroupContext_unstable(context => context.handleTagDismiss);

  const {
    appearance = 'filled-lighter',
    disabled = false,
    dismissible = false,
    interactive = false,
    onDismiss,
    shape = 'rounded',
    size = 'medium',
  } = props;

  const [dismissed, setDismissed] = React.useState(false);

  const dismiss = useEventCallback(() => {
    setDismissed(true);
    handleTagDismiss();
  });

  const dismissButtonShorthand = useARIAButtonShorthand(props.dismissButton, {
    required: props.dismissible,
    defaultProps: {
      disabled,
      type: 'button',
      children: <DismissIcon />,
    },
  });

  const onDismissButtonClick = useEventCallback(
    (ev: React.MouseEvent<HTMLButtonElement & HTMLDivElement & HTMLSpanElement & HTMLAnchorElement>) => {
      dismissButtonShorthand?.onClick?.(ev);
      if (!ev.defaultPrevented) {
        onDismiss?.(ev);
        dismiss();
      }
    },
  );

  const onDismissButtonKeyDown = useEventCallback(
    (ev: React.KeyboardEvent<HTMLButtonElement & HTMLDivElement & HTMLSpanElement & HTMLAnchorElement>) => {
      dismissButtonShorthand?.onKeyDown?.(ev);
      if (!ev.defaultPrevented && (ev.key === Delete || ev.key === Backspace)) {
        onDismiss?.(ev);
        dismiss();
      }
    },
  );

  return {
    components: {
      root: 'div',
      dismissButton: 'button',
    },

    appearance,
    disabled,
    dismissed,
    dismissible,
    interactive,
    shape,
    size,

    root: getNativeElementProps('div', {
      ref,
      ...props,
    }),
    dismissButton: dismissButtonShorthand
      ? {
          ...dismissButtonShorthand,
          onClick: onDismissButtonClick,
          onKeyDown: onDismissButtonKeyDown,
        }
      : undefined,
  };
};
