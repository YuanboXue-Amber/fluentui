import * as React from 'react';

import { TagButton, TagGroup, TagGroupProps } from '@fluentui/react-tags';

export const ControlledMultiSelect = () => {
  const [checkedItems, setCheckedItems] = React.useState<string[]>(['tag-controlled-1', 'tag-controlled-2']);
  const onCheckedItemsChange: TagGroupProps['onCheckedItemsChange'] = (e, { checkedItems }) => {
    setCheckedItems(checkedItems);
  };
  return (
    <TagGroup checkedItems={checkedItems} onCheckedItemsChange={onCheckedItemsChange}>
      <TagButton id={'tag-controlled-1'} shape="circular">
        Tag 1
      </TagButton>
      <TagButton id={'tag-controlled-2'} shape="circular">
        Tag 2
      </TagButton>
      <TagButton id={'tag-controlled-3'} shape="circular">
        Tag 3
      </TagButton>
    </TagGroup>
  );
};

ControlledMultiSelect.storyName = 'Dismiss';
ControlledMultiSelect.parameters = {
  docs: {
    description: {
      story:
        'The multi-selection state of TagGroup can be controlled with your own state. The onCheckedItemsChange callback will provide the hints for the state and triggers based on the appropriate event.',
    },
  },
};
