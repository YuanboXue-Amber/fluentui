# Api for a tree structure.

### Goal:

Give feature teams an easy API to manage a tree structure.

### Background:

The existing type we have:

```ts
type TreeItemValue = string;

type TreeItemProps = {
  icon?: React.ReactNode;
  // ... and other props for the tree item
};

type TreeItemType = 'leaf' | 'branch';
```

### Type of each item:

Each item in the tree has required property `value` and `parentValue` (both of type `TreeItemValue`), indicating its own identifier and the identifier of its parent item.

Each item has an optional `_nodeProps` value, which is an object containing additional properties of the node. This comes from the user when adding the item.

Each item has an optional `subtree` value, which is an array of items, indicating the children of the item.
If the item is a leaf, the `subtree` value should be an empty array, and the `itemType` value should be `'leaf'`. Otherwise, the `itemType` value should be `'branch'`. If `itemType` is not provided and the item has no children, the `itemType` value is by default `'leaf'`.

The result item type is:

```ts
type TreeNodeProps<Props extends Omit<TreeItemProps, 'value' | 'parentValue' | 'itemType'>> = {
  value: TreeItemValue;
  parentValue?: TreeItemValue;
  itemType?: TreeItemType;

  _nodeProps: Props;

  subtree?: TreeNodeProps<Props>[];
};
```

### Tree class:

There can be multiple root items in the tree, and the order of the root items is determined by the index.

The api contains the following methods:

1. `addNode({ value, parentValue, position, ...rest }: Props & { value: TreeItemValue; parentValue?: TreeItemValue; position?: number;} )`: add a new node to the tree.
   If the parent value is not provided, the new node will be added as a root node.
   If the position is not provided, the new node will be added as the last child of the parent node.
   If the parent node does not exist, create a console error and do not add the new node.
   If the tree has existing nodes with the same value, create a console error and do not add the new node.

2. `updateNode(value: TreeItemValue, nodeProps: Props, itemType?: TreeItemType)`: update the node with the new node properties (`node._nodeProps = nodeProps; node.itemType = itemType`).
   If the node does not exist, create a console error and do not update any node.

3. `removeNode(value)`: remove the node with the given value from the tree.
   If the node does not exist, create a console error and do not remove any node.
   If the node is a parent node, remove all its subtree as well.

4. `moveNode(value, parentValue, position)`: move the node with the given value to the new parent node with the given parentValue and the new position.
   If the parent node is not provided, but the position is provided, move the node to the new position in the same subtree.
   If the new parent node is the same as the current parent node, the node will be moved to the new position in the same subtree.
   If the position is not provided, move the node as the last child of the new parent node.
   If the node does not exist, create a console error and do not move any node.

5. `getTree(value)`: return the tree from the specified node with the given value, in the following format:

   ```js
   const result = {
     value: 1,
     itemType: 'branch',
     _nodeProps: {
       // ... nodeProps
     },
     subtree: [
       {
         value: 2,
         parentValue: 1,
         itemType: 'branch',
         _nodeProps: {
           // ... nodeProps
         },
         subtree: [
           {
             value: 3,
             parentValue: 2,
             itemType: 'leaf',
             _nodeProps: {
               // ... nodeProps
             },
           },
         ],
       },
       {
         value: 4,
         parentValue: 1,
         itemType: 'branch',
         _nodeProps: {
           // ... nodeProps
         },
         subtree: [],
       },
     ],
   };
   ```

If the node does not exist, create a console error and return `null`.
If the `value` is not provided, return the whole tree.

5. `getFlatTree(value)`, return the tree from the specified node with the given value, in the following format:

   ```js
   const result = [
     {
       value: 1,
       position: 0,
       itemType: 'branch',
       _nodeProps: {
         // ... nodeProps
       },
     },
     {
       value: 2,
       parentValue: 1,
       position: 0,
       itemType: 'branch',
       _nodeProps: {
         // ... nodeProps
       },
     },
     {
       value: 3,
       parentValue: 2,
       position: 0,
       itemType: 'leaf',
       _nodeProps: {
         // ... nodeProps
       },
     },
     {
       value: 4,
       parentValue: 1,
       position: 1,
       itemType: 'branch',
       _nodeProps: {
         // ... nodeProps
       },
     },
   ];
   ```

   The returned result is sorted as the pre-order traversal of the tree.
   The `position` is the index of the node in the parent node's subtree.
   If the node does not exist, create a console error and return `null`.
   If the `value` is not provided, return the whole tree.
