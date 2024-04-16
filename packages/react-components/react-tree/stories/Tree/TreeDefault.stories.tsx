import * as React from 'react';
import { TreeItemLayout, HeadlessFlatTreeItemProps, useEventCallback } from '@fluentui/react-components';
import { FlatVirtualizedTree, useHeadlessFlatVirtualizedTree } from '../../src/VirtualFlatTree';
import { DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContextWrapper, DndDragItem, DndFlatVirtualizedTreeItem } from '../../src/DndVirtualFlatTree';

type ItemProps = HeadlessFlatTreeItemProps;

const defaultItems: ItemProps[] = [
  {
    value: 'lvl-1_item-1',
    children: <TreeItemLayout>Level 1, item 1</TreeItemLayout>,
  },
  ...Array.from({ length: 300 }, (_, i) => ({
    value: `lvl-1_item-1--child:${i}`,
    parentValue: 'lvl-1_item-1',
    children: <TreeItemLayout>Item {i + 1}</TreeItemLayout>,
  })),
  {
    value: 'lvl-1_item-2',
    children: <TreeItemLayout>Level 1, item 2</TreeItemLayout>,
  },
  ...Array.from({ length: 300 }, (_, index) => ({
    value: `lvl-1_item-2--child:${index}`,
    parentValue: 'lvl-1_item-2',
    children: <TreeItemLayout>Item {index + 1}</TreeItemLayout>,
  })),
];

const estimateSize = () => 35;

// TODO - currently it only dnd leaf within same parent
const useDndHandlers = ({
  items,
  setItems,
}: {
  items: ItemProps[];
  setItems: React.Dispatch<React.SetStateAction<ItemProps[]>>;
}) => {
  const handleDragEnd = useEventCallback((event: DragEndEvent) => {
    console.log('handleDragEnd event', event);
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.value === active.id);
        const newIndex = items.findIndex(item => item.value === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setDraggingId('');
  });

  const [draggingId, setDraggingId] = React.useState('');
  const handleDragStart = useEventCallback((event: DragStartEvent) => {
    const { active } = event;
    setDraggingId(active.id as string);
  });

  const dndItems = items.map(item => ({ id: item.value }));
  return {
    handleDragEnd,
    handleDragStart,
    dndItems,
    draggingId,
  };
};

export const Default = () => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const [items, setItems] = React.useState(defaultItems);

  const headlessTree = useHeadlessFlatVirtualizedTree(items, {
    virtualizerOptions: {
      estimateSize,
      getScrollElement: () => parentRef.current,
    },
  });

  const virtualItems = headlessTree.getVirtualItems();

  const { handleDragEnd, handleDragStart, dndItems, draggingId } = useDndHandlers({
    items,
    setItems,
  });

  return (
    <DndContextWrapper onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <SortableContext items={dndItems} strategy={verticalListSortingStrategy}>
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
                  <DndFlatVirtualizedTreeItem
                    key={treeItemProps.value}
                    virtualItemProps={virtualItemProps}
                    {...treeItemProps}
                    isDragging={draggingId === treeItemProps.value}
                  />
                );
              })}
            </FlatVirtualizedTree>
          )}
        </div>
      </SortableContext>
      <DragOverlay>{draggingId ? <DndDragItem draggingId={draggingId} /> : null}</DragOverlay>
    </DndContextWrapper>
  );
};
