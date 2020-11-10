import * as React from 'react';
import CustomTreeTitle from './CustomTreeTitle';
import getItems from './itemsGenerator';
import { VirtualTree } from './VirtualTree';

const items = getItems();

const VirtualizedTreePrototype = () => {
  const getItemSize = React.useCallback((index: number) => 20, []);

  return (
    <VirtualTree
      items={items}
      renderItemTitle={CustomTreeTitle}
      itemSize={getItemSize}
      estimatedItemSize={20}
      height={300}
    />
  );
};

export default VirtualizedTreePrototype;
