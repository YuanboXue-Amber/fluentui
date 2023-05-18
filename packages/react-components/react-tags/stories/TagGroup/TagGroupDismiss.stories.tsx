import * as React from 'react';
import { TagGroup, Tag, TagButton, TagButtonProps, TagProps, TagGroupProps } from '@fluentui/react-tags';

export const Dismiss = () => {
  const defaultItems = [
    { value: '1', children: 'Tag 1' },
    { value: '2', children: 'Tag 2' },
    { value: 'tagButton-foo', children: 'Foo' },
    { value: 'tagButton-bar', children: 'Bar' },
  ];

  const [items, setItems] = React.useState<Array<TagProps | TagButtonProps>>(defaultItems);

  const removeItem: TagGroupProps['onDismiss'] = (_e, { dismissedTagId }) => {
    setItems([...items].filter(item => item.value !== dismissedTagId));
  };

  const isTagButton = (item: TagProps | TagButtonProps): item is TagButtonProps =>
    !!item.value?.startsWith('tagButton');

  return (
    <TagGroup onDismiss={removeItem}>
      {items.map(item =>
        isTagButton(item) ? (
          <TagButton key={item.value} dismissible {...item} />
        ) : (
          <Tag key={item.value} dismissible {...item} />
        ),
      )}
    </TagGroup>
  );
};

Dismiss.storyName = 'Dismiss';
Dismiss.parameters = {
  docs: {
    description: {
      story: 'A TagGroup contains a collection of Tag/TagButton that can be dismissed',
    },
  },
};
