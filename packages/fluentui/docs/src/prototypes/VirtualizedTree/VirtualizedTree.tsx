import * as React from 'react';
import { FixedSizeList as List } from 'react-window';
import { Tree, TreeItemProps } from '@fluentui/react-northstar';
import CustomTreeTitle from './CustomTreeTitle';
import getItems from './itemsGenerator';

class ItemWrapper extends React.PureComponent<{
  index: number;
  isScrolling?: boolean;
  style: Object;
  data: { renderedItems: any };
}> {
  render() {
    const { index, style, data } = this.props;
    const item = data.renderedItems[index];

    if (item) {
      return React.cloneElement(item as React.ReactElement, {
        style,
      });
    }
    return null;
  }
}

const RenderVirtualTree = ({ renderedItems, itemSize, height }) => {
  const getItemKey = React.useCallback((index: number, data) => {
    const item = data.renderedItems[index];
    if (item) {
      return item.id;
    }
    return index;
  }, []);
  return (
    <List
      {...{
        itemSize,
        itemKey: getItemKey,
        itemData: { renderedItems },
        height,
        itemCount: renderedItems.length,
      }}
    >
      {ItemWrapper}
    </List>
  );
};

const items = getItems();

const VirtualizedTreePrototype = () => {
  const renderItems = React.useCallback(
    (renderedItems: React.ReactElement<TreeItemProps>[]) => (
      <RenderVirtualTree renderedItems={renderedItems} itemSize={20} height={300} />
    ),
    [],
  );

  return <Tree items={items} renderItemTitle={CustomTreeTitle} renderedItems={renderItems} />;
};

export default VirtualizedTreePrototype;
