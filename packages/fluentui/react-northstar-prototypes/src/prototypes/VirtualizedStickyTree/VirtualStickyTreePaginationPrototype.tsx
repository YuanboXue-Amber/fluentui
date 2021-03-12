import * as React from 'react';
import { TriangleDownIcon, TreeTitleProps, TriangleEndIcon } from '@fluentui/react-northstar';
import getItems from './itemsGenerator';
import { VirtualStickyTreePagination } from './VirtualStickyTreePagination';
import * as _ from 'lodash';

const initialItems = getItems(3, 10, 1);

function getMoreItems(startIndex, loadedStickyNum, minItems = 3, maxItems = 10, maxLevel = 1) {
  function getItemsNumber(min: number, max: number) {
    return _.random(min, max);
  }

  function generateLevel(level: number, parent = '') {
    const result = [];
    _.times(level === 0 ? loadedStickyNum : getItemsNumber(minItems, maxItems), (index) => {
      const item = {
        id: `${parent}${parent ? '-' : ''}${level === 0 ? index + startIndex : index}`,
        title: `Tree-Item-${parent}${parent ? '-' : ''}${level === 0 ? index + startIndex : index}`,
        ...(level < maxLevel && {
          items: generateLevel(level + 1, `${parent}${level === 0 ? index + startIndex : index}`),
        }),
      };
      result.push(item);
    });
    return result;
  }

  return generateLevel(0);
}

const CustomTreeTitle = (
  Component: React.ElementType<TreeTitleProps>,
  { content, expanded, hasSubtree, ...restProps }: TreeTitleProps,
) => (
  <Component expanded={expanded} hasSubtree={hasSubtree} {...restProps}>
    {hasSubtree && (expanded ? <TriangleDownIcon /> : <TriangleEndIcon />)}
    {content}
  </Component>
);

const itemToString = (item) => item.title;

const fetchData = (items) => {
  return new Promise<{ items: any; hasNextPage: boolean }>((resolve) =>
    setTimeout(() => {
      const newItems = items.concat(getMoreItems(items.length, 5));
      const result = {
        items: newItems,
        hasNextPage: true,
      };
      resolve(result);
    }, 10000),
  );
};

const VirtualStickyTreePaginationPrototype = () => {
  const [items, setItems] = React.useState(initialItems);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(true);

  const loadMoreRows = isLoading
    ? () => Promise.resolve()
    : async () => {
        setIsLoading(true);
        const result = await fetchData(items);
        setIsLoading(false);
        setHasNextPage(result.hasNextPage);
        setItems(result.items);
      };

  return (
    <div style={{ width: 400 }}>
      <VirtualStickyTreePagination
        items={items}
        renderItemTitle={CustomTreeTitle}
        itemSize={30}
        stickyItemSize={20}
        height={500}
        itemToString={itemToString}
        hasNextPage={hasNextPage}
        isNextPageLoading={isLoading}
        onLoadNextPage={loadMoreRows}
      />
    </div>
  );
};
export default VirtualStickyTreePaginationPrototype;
