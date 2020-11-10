import * as React from 'react';
import { Accessibility, treeBehavior, TreeBehaviorProps } from '@fluentui/accessibility';
import {
  ComponentWithAs,
  useTelemetry,
  useUnhandledProps,
  getElementType,
  useAccessibility,
  useStyles,
  useFluentContext,
} from '@fluentui/react-bindings';
import * as customPropTypes from '@fluentui/react-proptypes';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import {
  ChildrenComponentProps,
  commonPropTypes,
  createShorthandFactory,
  FluentComponentStaticProps,
  ObjectShorthandCollection,
  rtlTextContainer,
  ShorthandRenderFunction,
  TreeTitle,
  TreeTitleProps,
  UIComponentProps,
  TreeItem,
  TreeItemProps,
} from '@fluentui/react-northstar';
import { TreeContext, TreeRenderContextValue } from '@fluentui/react-northstar/src/components/Tree/context';
import { useTree } from '@fluentui/react-northstar/src/components/Tree/hooks/useTree';
import { VariableSizeList } from 'react-window';

export interface VirtualTreeProps extends UIComponentProps, ChildrenComponentProps {
  /** Accessibility behavior if overridden by the user. */
  accessibility?: Accessibility<TreeBehaviorProps>;

  /** Ids of expanded items. */
  activeItemIds?: string[];

  /** Initial activeItemIds value. */
  defaultActiveItemIds?: string[];

  /** Shorthand array of props for Tree. */
  items?: ObjectShorthandCollection<TreeItemProps>;

  /**
   * A custom render function for the title slot.
   *
   * @param Component - The computed component for this slot.
   * @param props - The computed props for this slot.
   * @param children - The computed children for this slot.
   */
  renderItemTitle?: ShorthandRenderFunction<TreeTitleProps>;

  height: number;
  estimatedItemSize: number;
  itemSize: (index: number) => number;
}

export const virtualTreeClassName = 'ui-virtualtree';

export type VirtualTreeStylesProps = never;

export const VirtualTree: ComponentWithAs<'div', VirtualTreeProps> &
  FluentComponentStaticProps<VirtualTreeProps> & {
    Item: typeof TreeItem;
    Title: typeof TreeTitle;
  } = props => {
  const context = useFluentContext();
  const { setStart, setEnd } = useTelemetry(VirtualTree.displayName, context.telemetry);
  setStart();

  const { children, className, design, styles, variables, renderItemTitle } = props;

  const ElementType = getElementType(props);
  if (ElementType !== 'div') {
    // TODO virtual tree only works with div because of react-window. Maybe we give console warn?
  }

  const unhandledProps = useUnhandledProps(VirtualTree.handledProps, props);

  const getA11yProps = useAccessibility(props.accessibility, {
    debugName: VirtualTree.displayName,
    rtl: context.rtl,
  });

  const { classes } = useStyles<VirtualTreeStylesProps>(VirtualTree.displayName, {
    className: virtualTreeClassName,
    mapPropsToInlineStyles: () => ({
      className,
      design,
      styles,
      variables,
    }),
    rtl: context.rtl,
  });

  const {
    visibleItemIds,
    getItemById,
    registerItemRef,
    toggleItemActive,
    focusParent,
    focusFirstChild,
    siblingsExpand,
  } = useTree(props);

  const contextValue: TreeRenderContextValue = React.useMemo(
    () => ({
      getItemById,
      registerItemRef,
      toggleItemActive,
      focusParent,
      siblingsExpand,
      focusFirstChild,
      toggleItemSelect: _.noop,
    }),
    [getItemById, registerItemRef, toggleItemActive, focusParent, siblingsExpand, focusFirstChild],
  );

  // todo data typing
  const getItemKey = React.useCallback((index: number, data) => {
    const { getItemById, visibleItemIds } = data;
    const id = visibleItemIds[index];
    if (getItemById(id)) {
      return id;
    }
    return index;
  }, []);

  // TODO react-window list has `direction` prop, it is in conflict with our focuszone direction prop
  const element = (
    <TreeContext.Provider value={contextValue}>
      {getA11yProps.unstable_wrapWithFocusZone(
        <VariableSizeList
          {...getA11yProps('root', {
            className: classes.root,
            ...rtlTextContainer.getAttributes({ forElements: [children] }),
            ...unhandledProps,
          })}
          itemKey={getItemKey}
          itemData={{ getItemById, visibleItemIds, getA11yProps, renderItemTitle }}
          itemCount={visibleItemIds.length}
        >
          {ItemWrapper}
        </VariableSizeList>,
      )}
    </TreeContext.Provider>
  );
  setEnd();
  return element;
};

class ItemWrapper extends React.PureComponent<{
  index: number;
  isScrolling?: boolean;
  style: Object;
  data: any; // todo
}> {
  render() {
    const { index, style, data } = this.props;
    const { getItemById, visibleItemIds, getA11yProps, renderItemTitle } = data;

    const id = visibleItemIds[index];
    const item = getItemById(id);

    if (item) {
      const { expanded, parent, level, index, treeSize } = item;
      return TreeItem.create(item.item, {
        defaultProps: () =>
          getA11yProps('item', {
            style,
            key: id,
            expanded,
            parent,
            level,
            index,
            treeSize,
            selectable: false,
            renderItemTitle: item.item.renderItemTitle || renderItemTitle,
          }),
      });
    }
    return null;
  }
}

VirtualTree.displayName = 'VirtualTree';

VirtualTree.propTypes = {
  ...commonPropTypes.createCommon({
    content: false,
  }),
  activeItemIds: customPropTypes.collectionShorthand,
  defaultActiveItemIds: customPropTypes.collectionShorthand,
  items: customPropTypes.collectionObjectShorthand,
  renderItemTitle: PropTypes.func,
};

VirtualTree.Item = TreeItem;
VirtualTree.Title = TreeTitle;

VirtualTree.defaultProps = {
  accessibility: treeBehavior,
  estimatedItemSize: 50,
};

VirtualTree.handledProps = Object.keys(VirtualTree.propTypes) as any;

VirtualTree.create = createShorthandFactory({
  Component: VirtualTree,
  mappedArrayProp: 'items',
});
