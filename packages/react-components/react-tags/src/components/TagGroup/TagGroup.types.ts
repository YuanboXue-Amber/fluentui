import * as React from 'react';
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type TagGroupCheckedItemsChangeEvent = React.MouseEvent | React.KeyboardEvent;

export type TagGroupCheckedItemsChangeData = {
  /** Checked items' ids */
  checkedItems: string[];
};

export type TagGroupSlots = {
  root: Slot<'div'>;
};

/**
 * TagGroup Props
 */
export type TagGroupProps = ComponentProps<TagGroupSlots> & {
  /**
   * All checked items' ids
   */
  checkedItems?: string[];

  /**
   * Default items to be checked on mount
   */
  defaultCheckedItems?: string[];

  /**
   * Callback when checked items change
   *
   * @param event - React's original SyntheticEvent
   * @param data - A data object with relevant information
   */
  onCheckedItemsChange?: (e: TagGroupCheckedItemsChangeEvent, data: TagGroupCheckedItemsChangeData) => void;
};

/**
 * State used in rendering TagGroup
 */
export type TagGroupState = ComponentState<TagGroupSlots> &
  Required<Pick<TagGroupProps, 'checkedItems'>> &
  Pick<TagGroupProps, 'onCheckedItemsChange'> & {
    toggleCheckedItems: (e: React.MouseEvent | React.KeyboardEvent, id: string, checked: boolean) => void;
  };
