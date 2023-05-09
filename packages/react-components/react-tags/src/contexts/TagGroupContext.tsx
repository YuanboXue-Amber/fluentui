import * as React from 'react';
import { TagGroupState } from '../components/TagGroup/index';

export const TagGroupContext = React.createContext<TagGroupContextValue | undefined>(undefined);

const tagGroupContextDefaultValue: TagGroupContextValue = {
  handleTagDismiss: () => null,
};

/**
 * Context shared between TagGroup and its children components
 */
export type TagGroupContextValue = Pick<TagGroupState, 'handleTagDismiss'>;

export const TagGroupContextProvider = TagGroupContext.Provider;

export const useTagGroupContext_unstable = () => React.useContext(TagGroupContext) ?? tagGroupContextDefaultValue;
