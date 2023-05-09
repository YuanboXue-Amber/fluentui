import type { TagGroupContextValue } from '../../contexts/TagGroupContext';
import type { TagGroupState } from './TagGroup.types';

export function useTagGroupContextValue_unstable(state: TagGroupState): TagGroupContextValue {
  const { handleTagDismiss } = state;
  return { handleTagDismiss };
}
