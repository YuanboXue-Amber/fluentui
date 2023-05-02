import { TagGroup } from '@fluentui/react-tags';

import descriptionMd from './TagGroupDescription.md';
import bestPracticesMd from './TagGroupBestPractices.md';

export { Default } from './TagGroupDefault.stories';
export { ControlledMultiSelect } from './TagGroupControlledMultiSelect.stories';

export default {
  title: 'Preview Components/TagGroup',
  component: TagGroup,
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
};
