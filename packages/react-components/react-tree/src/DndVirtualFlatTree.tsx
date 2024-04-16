import * as React from 'react';
import { ForwardRefComponent, useMergedRefs, TreeItemValue } from '@fluentui/react-components';
import { FlatVirtualizedTreeItem, FlatVirtualizedTreeItemProps } from './VirtualFlatTree';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { isHTMLElement } from '@fluentui/react-utilities';

export const DndFlatVirtualizedTreeItem: ForwardRefComponent<FlatVirtualizedTreeItemProps & { isDragging: boolean }> =
  React.forwardRef((props, ref) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.value });

    const style = {
      transform: CSS.Transform.toString(transform), // apply visual update when dragging, without the need to update DOM
      transition, // 'ease' function to make dragging look smooth
      visibility: props.isDragging ? 'hidden' : 'visible', // hide dropped item while dragging, because we show dragging using DragOverlay
      ...props.style,
    };

    if (props.value === `lvl-1_item-1--child:${30}`) {
      console.log('item 30 transform', transform);
    }

    const mergedRef = useMergedRefs(setNodeRef, ref);

    return <FlatVirtualizedTreeItem {...props} ref={mergedRef} style={style} {...attributes} {...listeners} />;
  });

export const DndContextWrapper = ({
  onDragEnd,
  onDragStart,
  children,
}: {
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart: (event: DragStartEvent) => void;
  children: React.ReactNode;
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // without this, click expand/collapse stop working
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
    >
      {children}
    </DndContext>
  );
};

export const DndDragItem = ({ draggingId }: { draggingId: TreeItemValue }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    console.log('amber draggingId', draggingId);
    if (!draggingId) {
      return;
    }

    // Delaying the cloning process until the next event loop tick to ensure
    // that any animations or state changes (like collapse/expand) of the tree
    // item have been completed. This ensures that the cloned node is an accurate
    // and up-to-date representation of the active item.
    const timerId = setTimeout(() => {
      const activeNode = document.querySelector(`[data-fui-tree-item-value="${draggingId}"]`);
      if (!activeNode || !isHTMLElement(activeNode)) {
        return;
      }

      const clonedNode = activeNode.cloneNode(true) as HTMLElement;
      if (clonedNode) {
        clonedNode.style.top = '0px';
        clonedNode.style.visibility = 'visible';
        clonedNode.style.transform = 'unset';
        if (ref.current && ref.current.firstChild) {
          ref.current.removeChild(ref.current.firstChild);
        }
        ref.current?.appendChild(clonedNode);
      }
    }, 0);

    return () => clearTimeout(timerId);
  }, [draggingId]);

  return <div id={'dnd-overlay-item'} ref={ref} role="presentation" tabIndex={0} />;
};
