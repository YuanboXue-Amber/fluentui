import * as React from 'react';
import { TagGroup, Tag, TagButton, TagButtonProps, TagProps, TagGroupProps } from '@fluentui/react-tags';

export const Dismiss = () => {
  const defaultItems = [
    { id: '1', children: 'Tag 1' },
    { id: '2', children: 'Tag 2' },
    { id: 'tagButton-foo', children: 'Foo' },
    { id: 'tagButton-bar', children: 'Bar' },
  ];

  const [items, setItems] = React.useState(defaultItems);

  const removeItem: TagGroupProps['onDismiss'] = (_e, { dismissedTagId }) => {
    const newItems = [...items];
    newItems.splice(
      newItems.findIndex(item => item.id === dismissedTagId),
      1,
    );
    setItems(newItems);
  };

  const isTagButton = (item: TagProps | TagButtonProps): item is TagButtonProps => !!item.id?.startsWith('tagButton');

  return (
    <TagGroup<TagProps | TagButtonProps> items={items} onDismiss={removeItem}>
      {item =>
        isTagButton(item) ? (
          <TagButton key={item.id} dismissible {...item} />
        ) : (
          <Tag key={item.id} dismissible {...item} />
        )
      }
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
