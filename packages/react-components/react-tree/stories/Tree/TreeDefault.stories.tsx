/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */
import * as React from 'react';
import {
  FlatTreeProps,
  FlatTreeItem,
  TreeItemLayout,
  TreeProvider,
  FlatTreeSlots,
  TreeNavigationData_unstable,
  TreeNavigationEvent_unstable,
  useFlatTree_unstable,
  HeadlessFlatTreeItemProps,
  useFlatTreeStyles_unstable,
  useFlatTreeContextValues_unstable,
  HeadlessFlatTreeItem,
  useHeadlessFlatTree_unstable,
  useMergedRefs,
  mergeClasses,
  Slot,
  ComponentProps,
  ComponentState,
  slot,
  getIntrinsicElementProps,
  FlatTreeState,
} from '@fluentui/react-components';
import { ForwardRefComponent, assertSlots } from '@fluentui/react-components';
import { VirtualizerOptions, useVirtualizer } from '@tanstack/react-virtual';

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

type FlatVirtualizedTreeSlot = FlatTreeSlots & {
  // TODO ban children from container type
  container: NonNullable<Slot<'div'>>;
};

type FlatVirtualizedTreeProps = FlatTreeProps &
  ComponentProps<FlatVirtualizedTreeSlot> & {
    children: React.ReactElement<typeof FlatTreeItem>[];
  } & Pick<VirtualizerOptions<Element, Element>, 'estimateSize'>;

type FlatVirtualizedTreeState = FlatTreeState & ComponentState<FlatVirtualizedTreeSlot>;

const useFlatVirtualizedTree = (
  props: FlatVirtualizedTreeProps,
  ref: React.Ref<HTMLDivElement>,
): FlatVirtualizedTreeState => {
  const baseState = useFlatTree_unstable(props, ref);

  const state = {
    ...baseState,
    components: { ...baseState.components, container: 'div' },
    container: slot.always(props.container, { elementType: 'div' }),
  };

  // -------- begin virtualization

  const parentRef = React.useRef<HTMLDivElement>(null);
  state.container.ref = useMergedRefs(state.container.ref, parentRef);

  state.root.children = state.root.children ?? [];
  const rowVirtualizer = useVirtualizer({
    count: state.root.children.length,
    getScrollElement: () => parentRef.current,
    estimateSize: props.estimateSize,
  });

  state.root.style = {
    ...state.root.style,
    height: `${rowVirtualizer.getTotalSize()}px`,
    width: '100%',
    position: 'relative',
  };

  state.root.children = rowVirtualizer.getVirtualItems().map(virtualItem => (
    <div
      key={virtualItem.key}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
      }}
    >
      {state.root.children[virtualItem.index]}
    </div>
  ));

  // TODO handleNavigation

  // -------- end virtualization
  return state;
};

export const FlatVirtualizedTree: ForwardRefComponent<FlatVirtualizedTreeProps> = React.forwardRef((props, ref) => {
  const state = useFlatVirtualizedTree(props, ref);
  const contextValues = useFlatTreeContextValues_unstable(state);
  useFlatTreeStyles_unstable(state);

  // return renderFlatTree_unstable(state, contextValues);
  assertSlots<FlatVirtualizedTreeSlot>(state);
  return (
    <TreeProvider value={contextValues.tree}>
      <state.container>
        <state.root />
      </state.container>
    </TreeProvider>
  );
});

const estimateSize = () => 35;
export const Default = () => {
  const headlessTree = useHeadlessFlatTree_unstable(defaultItems);

  return (
    <FlatVirtualizedTree
      {...headlessTree.getTreeProps()}
      aria-label="Flat Virtualized Tree"
      estimateSize={estimateSize}
      container={{ style: { height: '50vh', overflow: 'auto' } }}
    >
      {Array.from(headlessTree.items(), flatTreeItem => {
        const treeItemProps = flatTreeItem.getTreeItemProps();
        return <FlatTreeItem {...treeItemProps} />;
      })}
    </FlatVirtualizedTree>
  );
};
