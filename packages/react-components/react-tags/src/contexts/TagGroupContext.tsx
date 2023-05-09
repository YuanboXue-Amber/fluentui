import { createContext, useContextSelector } from '@fluentui/react-context-selector';
import type { ContextSelector, Context } from '@fluentui/react-context-selector';
import { TagGroupState } from '../components/TagGroup/index';

export const TagGroupContext: Context<TagGroupContextValue> = createContext<TagGroupContextValue | undefined>(
  undefined,
) as Context<TagGroupContextValue>;

const tagGroupContextDefaultValue: TagGroupContextValue = {
  handleTagDismiss: () => null,
};

/**
 * Context shared between TagGroup and its children components
 */
export type TagGroupContextValue = Pick<TagGroupState, 'handleTagDismiss'>;

export const TagGroupContextProvider = TagGroupContext.Provider;

export const useTagGroupContext_unstable = <T,>(selector: ContextSelector<TagGroupContextValue, T>) =>
  useContextSelector(TagGroupContext, (ctx = tagGroupContextDefaultValue) => selector(ctx));
