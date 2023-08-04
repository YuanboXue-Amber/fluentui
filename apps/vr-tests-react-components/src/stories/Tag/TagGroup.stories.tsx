import * as React from 'react';
import { TagGroup, Tag, InteractionTag, Primary } from '@fluentui/react-tags-preview';
import { ComponentMeta } from '@storybook/react';
import { Steps } from 'storywright';
import { withStoryWrightSteps } from '../../utilities';

const steps = new Steps().snapshot('default', { cropTo: '.testWrapper' }).end();

export default {
  title: 'TagGroup Converged',
  Component: TagGroup,
  decorators: [story => withStoryWrightSteps({ story, steps })],
} as ComponentMeta<typeof TagGroup>;

export const Default = () => (
  <TagGroup>
    <Tag>Tag 1</Tag>
    <Tag>Tag 2</Tag>
    <Tag>Tag 3</Tag>
  </TagGroup>
);

const onDismiss = () => ({});
export const Dismissible = () => (
  <TagGroup onDismiss={onDismiss}>
    <Tag>Tag 1</Tag>
    <Tag>Tag 2</Tag>
    <Tag>Tag 3</Tag>
  </TagGroup>
);

export const DismissibleWithInteractionTag = () => (
  <TagGroup onDismiss={onDismiss}>
    <InteractionTag>
      <Primary>Tag 1</Primary>
    </InteractionTag>
    <InteractionTag>
      <Primary>Tag 2</Primary>
    </InteractionTag>
    <InteractionTag>
      <Primary>Tag 3</Primary>
    </InteractionTag>
  </TagGroup>
);

// size
export const SizeSmall = () => (
  <TagGroup size="small">
    <Tag>Tag 1</Tag>
    <Tag>Tag 2</Tag>
    <Tag>Tag 3</Tag>
  </TagGroup>
);

export const SizeExtraSmall = () => (
  <TagGroup size="extra-small">
    <Tag>Tag 1</Tag>
    <Tag>Tag 2</Tag>
    <Tag>Tag 3</Tag>
  </TagGroup>
);
