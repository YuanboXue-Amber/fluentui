import * as React from 'react';
import { createContext, useContextSelector } from '@fluentui/react-context-selector';
import type { ContextSelector, Context } from '@fluentui/react-context-selector';

import { TagGroupProps } from '../components/TagGroup/index';

export const TagGroupContext: Context<TagGroupContextValue> = createContext<TagGroupContextValue | undefined>(
  undefined,
) as Context<TagGroupContextValue>;

const tagGroupContextDefaultValue: TagGroupContextValue = {
  checkedItems: [],
  toggleCheckedItems: () => null,
};

/**
 * Context shared between TagGroup and its children components
 */
export type TagGroupContextValue = Pick<TagGroupProps, 'checkedItems'> & {
  toggleCheckedItems?: (e: React.MouseEvent | React.KeyboardEvent, id: string, checked: boolean) => void;
};

export const TagGroupContextProvider = TagGroupContext.Provider;

export const useTagGroupContext_unstable = <T,>(selector: ContextSelector<TagGroupContextValue, T>) =>
  useContextSelector(TagGroupContext, (ctx = tagGroupContextDefaultValue) => selector(ctx));
