import * as React from 'react';
import { TagGroup, Tag, TagContent, TagGroupProps } from '@fluentui/react-tags';
import { Calendar3Day20Regular, Calendar3Day20Filled, bundleIcon } from '@fluentui/react-icons';
import { Avatar } from '@fluentui/react-components';

const Calendar3Day20Icon = bundleIcon(Calendar3Day20Filled, Calendar3Day20Regular);

export const Default = (props: Partial<TagGroupProps>) => (
  <TagGroup {...props}>
    <Tag dismissible shape="circular">
      <TagContent icon={<Calendar3Day20Icon />}>Tag 1</TagContent>
    </Tag>
    <Tag interactive dismissible shape="circular">
      <TagContent icon={<Calendar3Day20Icon />}>Tag 2</TagContent>
    </Tag>
    <Tag interactive dismissible>
      <TagContent
        media={
          <Avatar
            {...{
              name: 'Katri Athokas',
              badge: { status: 'busy' },
              image: {
                src: 'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/KatriAthokas.jpg',
              },
            }}
          />
        }
      >
        Tag 3
      </TagContent>
    </Tag>
  </TagGroup>
);
