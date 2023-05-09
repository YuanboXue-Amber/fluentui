import * as React from 'react';
import { getNativeElementProps, resolveShorthand, useEventCallback } from '@fluentui/react-utilities';
import { DismissRegular, bundleIcon, DismissFilled } from '@fluentui/react-icons';
import type { TagButtonProps, TagButtonState } from './TagButton.types';
import { useARIAButtonShorthand } from '@fluentui/react-aria';
import { Delete, Backspace } from '@fluentui/keyboard-keys';

const tagButtonAvatarSizeMap = {
  medium: 28,
  small: 24,
  'extra-small': 20,
} as const;

const tagButtonAvatarShapeMap = {
  rounded: 'square',
  circular: 'circular',
} as const;

const DismissIcon = bundleIcon(DismissFilled, DismissRegular);

/**
 * Create the state required to render TagButton.
 *
 * The returned state can be modified with hooks such as useTagButtonStyles_unstable,
 * before being passed to renderTagButton_unstable.
 *
 * @param props - props from this instance of TagButton
 * @param ref - reference to root HTMLElement of TagButton
 */
export const useTagButton_unstable = (props: TagButtonProps, ref: React.Ref<HTMLElement>): TagButtonState => {
  const {
    appearance = 'filled-lighter',
    disabled = false,
    dismissible = false,
    onDismiss,
    shape = 'rounded',
    size = 'medium',
  } = props;

  const [dismissed, setDismissed] = React.useState(false);

  const onDismissButtonClick = useEventCallback(
    (ev: React.MouseEvent<HTMLButtonElement & HTMLDivElement & HTMLSpanElement & HTMLAnchorElement>) => {
      props.onClick?.(ev);
      if (!ev.defaultPrevented) {
        onDismiss?.(ev);
        setDismissed(true);
      }
    },
  );

  const onDismissButtonKeyDown = useEventCallback(
    (ev: React.KeyboardEvent<HTMLButtonElement & HTMLDivElement & HTMLSpanElement & HTMLAnchorElement>) => {
      props?.onKeyDown?.(ev);
      if (!ev.defaultPrevented && (ev.key === Delete || ev.key === Backspace)) {
        onDismiss?.(ev);
        setDismissed(true);
      }
    },
  );

  const dismissButtonShorthand = useARIAButtonShorthand(props.dismissButton, {
    required: props.dismissible,
    defaultProps: {
      disabled,
      type: 'button',
      children: <DismissIcon />,
    },
  });

  return {
    appearance,
    avatarShape: tagButtonAvatarShapeMap[shape],
    avatarSize: tagButtonAvatarSizeMap[size],
    disabled,
    dismissed,
    dismissible,
    shape,
    size,

    components: {
      root: 'div',
      content: 'div',
      media: 'span',
      icon: 'span',
      primaryText: 'span',
      secondaryText: 'span',
      dismissButton: 'button',
    },

    root: getNativeElementProps('div', {
      ref,
      ...props,
    }),

    content: useARIAButtonShorthand(props.content, {
      required: true,
      defaultProps: {
        disabled,
        tabIndex: 0,
        type: 'button',
      },
    }),
    media: resolveShorthand(props.media),
    icon: resolveShorthand(props.icon),
    primaryText: resolveShorthand(props.primaryText, { required: true }),
    secondaryText: resolveShorthand(props.secondaryText),

    dismissButton: dismissButtonShorthand
      ? {
          ...dismissButtonShorthand,
          onClick: onDismissButtonClick,
          onKeyDown: onDismissButtonKeyDown,
        }
      : undefined,
  };
};
