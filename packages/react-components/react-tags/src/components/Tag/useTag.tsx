import * as React from 'react';
import { getNativeElementProps, resolveShorthand, useEventCallback } from '@fluentui/react-utilities';
import { DismissRegular, bundleIcon, DismissFilled } from '@fluentui/react-icons';
import type { TagProps, TagState } from './Tag.types';
import { Delete, Backspace } from '@fluentui/keyboard-keys';

const tagAvatarSizeMap = {
  medium: 28,
  small: 24,
  'extra-small': 20,
} as const;

const tagAvatarShapeMap = {
  rounded: 'square',
  circular: 'circular',
} as const;

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
  const {
    appearance = 'filled-lighter',
    disabled = false,
    dismissible = false,
    onDismiss,
    shape = 'rounded',
    size = 'medium',
  } = props;

  const [dismissed, setDismissed] = React.useState(false);

  const handleClick = useEventCallback(
    (ev: React.MouseEvent<HTMLButtonElement & HTMLDivElement & HTMLSpanElement & HTMLAnchorElement>) => {
      props.onClick?.(ev);
      if (!ev.defaultPrevented) {
        onDismiss?.(ev);
        setDismissed(true);
      }
    },
  );

  const handleKeyDown = useEventCallback(
    (ev: React.KeyboardEvent<HTMLButtonElement & HTMLDivElement & HTMLSpanElement & HTMLAnchorElement>) => {
      props?.onKeyDown?.(ev);
      if (!ev.defaultPrevented && (ev.key === Delete || ev.key === Backspace)) {
        onDismiss?.(ev);
        setDismissed(true);
      }
    },
  );

  return {
    appearance,
    avatarShape: tagAvatarShapeMap[shape],
    avatarSize: tagAvatarSizeMap[size],
    disabled,
    dismissed,
    dismissible,
    shape,
    size,

    components: {
      root: 'button',
      media: 'span',
      icon: 'span',
      primaryText: 'span',
      secondaryText: 'span',
      dismissIcon: 'span',
    },

    root: getNativeElementProps('button', {
      ref,
      ...props,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    }),

    media: resolveShorthand(props.media),
    icon: resolveShorthand(props.icon),
    primaryText: resolveShorthand(props.primaryText, {
      required: true,
      defaultProps: {
        children: props.children,
      },
    }),
    secondaryText: resolveShorthand(props.secondaryText),
    dismissIcon: resolveShorthand(props.dismissIcon, {
      required: props.dismissible,
      defaultProps: {
        children: <DismissIcon />,
      },
    }),
  };
};
