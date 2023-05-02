import * as React from 'react';
import { TagButton, TagGroup, TagGroupProps } from '@fluentui/react-tags';
import { Calendar3Day20Regular, Calendar3Day20Filled, bundleIcon } from '@fluentui/react-icons';

const Calendar3Day20Icon = bundleIcon(Calendar3Day20Filled, Calendar3Day20Regular);

export const Default = (props: Partial<TagGroupProps>) => (
  <TagGroup {...props}>
    <TagButton shape="circular" icon={<Calendar3Day20Icon />} dismissable>
      Tag 1
    </TagButton>
    <TagButton shape="circular" icon={<Calendar3Day20Icon />}>
      Tag 2
    </TagButton>
    <TagButton shape="circular" icon={<Calendar3Day20Icon />}>
      Tag 3
    </TagButton>
  </TagGroup>
);
