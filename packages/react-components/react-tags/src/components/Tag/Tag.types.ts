import * as React from 'react';
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type TagContextValue = Required<Pick<TagProps, 'dismissible' | 'shape' | 'size' | 'interactive'>>;

export type TagContextValues = {
  tag: TagContextValue;
};

export type TagSlots = {
  root: NonNullable<Slot<'div'>>;

  dismissButton: Slot<'button'>;
};

/**
 * Tag Props
 */
export type TagProps = ComponentProps<Partial<TagSlots>> & {
  size?: 'extra-small' | 'small' | 'medium';
  shape?: 'rounded' | 'circular';
  appearance?: 'filled-darker' | 'filled-lighter' | 'tint' | 'outline';
  disabled?: boolean;

  // TODO implement checked state
  // checked?: boolean;

  dismissible?: boolean;
  onDismiss?: (e: React.MouseEvent | React.KeyboardEvent) => void;

  interactive?: boolean;
};

/**
 * State used in rendering Tag
 */
export type TagState = ComponentState<TagSlots> &
  Required<Pick<TagProps, 'appearance' | 'disabled' | 'dismissible' | 'shape' | 'size' | 'interactive'>> & {
    dismissed?: boolean;
  };
