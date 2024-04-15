import * as React from 'react';
import { TreeItemLayout, HeadlessFlatTreeItemProps } from '@fluentui/react-components';
import {
  FlatVirtualizedTreeItem,
  FlatVirtualizedTree,
  useHeadlessFlatVirtualizedTree,
} from '../../src/VirtualFlatTree';

type ItemProps = HeadlessFlatTreeItemProps;

const defaultItems: ItemProps[] = [
  {
    value: 'flatTreeItem_lvl-1_item-1',
    children: <TreeItemLayout>Level 1, item 1</TreeItemLayout>,
  },
  ...Array.from({ length: 300 }, (_, i) => ({
    value: `flatTreeItem_lvl-1_item-1--child:${i}`,
    parentValue: 'flatTreeItem_lvl-1_item-1',
    children: <TreeItemLayout>Item {i + 1}</TreeItemLayout>,
  })),
  {
    value: 'flatTreeItem_lvl-1_item-2',
    children: <TreeItemLayout>Level 1, item 2</TreeItemLayout>,
  },
  ...Array.from({ length: 300 }, (_, index) => ({
    value: `flatTreeItem_lvl-1_item-2--child:${index}`,
    parentValue: 'flatTreeItem_lvl-1_item-2',
    children: <TreeItemLayout>Item {index + 1}</TreeItemLayout>,
  })),
];

const estimateSize = () => 35;

export const Default = () => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const headlessTree = useHeadlessFlatVirtualizedTree(defaultItems, {
    virtualizerOptions: {
      estimateSize,
      getScrollElement: () => parentRef.current,
    },
  });

  const virtualItems = headlessTree.getVirtualItems();

  return (
    <div ref={parentRef} style={{ height: '50vh', overflow: 'auto' }}>
      {/* An empty Tree that has no children on 1st render won't have keyboard navigation initialized. */}
      {virtualItems.length && (
        <FlatVirtualizedTree
          {...headlessTree.getTreeProps()}
          aria-label="Flat Virtualized Tree"
          style={{ height: `${headlessTree.getTotalSize()}px` }}
        >
          {virtualItems.map(flatTreeItem => {
            const { getTreeItemProps, virtualItemProps } = flatTreeItem;
            const treeItemProps = getTreeItemProps();
            return (
              <FlatVirtualizedTreeItem
                key={treeItemProps.value}
                virtualItemProps={virtualItemProps}
                {...treeItemProps}
              />
            );
          })}
        </FlatVirtualizedTree>
      )}
    </div>
  );
};
