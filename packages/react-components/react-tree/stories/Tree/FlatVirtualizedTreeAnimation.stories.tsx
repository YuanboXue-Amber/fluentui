import * as React from 'react';
import {
  FlatTree,
  TreeItem,
  TreeItemLayout,
  useHeadlessFlatTree_unstable,
  flattenTree_unstable,
  FlattenTreeItem,
  TreeItemProps,
  makeStyles,
  shorthands,
  tokens,
  ForwardRefComponent,
  Checkbox,
  HeadlessFlatTreeOptions,
  TreeItemValue,
  Slider,
  Label,
  TreeNavigationEvent_unstable,
  TreeNavigationData_unstable,
  HeadlessFlatTree,
  HeadlessFlatTreeItem,
  HeadlessFlatTreeItemProps,
  TreeItemPersonaLayout,
  Avatar,
} from '@fluentui/react-components';
import { MotionImperativeRef, createPresenceComponent } from '@fluentui/react-motions-preview';
import { useEventCallback, useId, useIsomorphicLayoutEffect, usePrevious } from '@fluentui/react-utilities';
import { VirtualItem, useVirtualizer } from '@tanstack/react-virtual';

const allItemsNested: FlattenTreeItem<TreeItemProps & { height: number }>[] = [
  {
    value: 'folder 0',
    children: <TreeItemLayout>folder 0</TreeItemLayout>,
    height: 32,
    subtree: Array.from({ length: 30 }, (_, i) => ({
      value: `folder 0 child ${i}`,
      children: (
        <TreeItemPersonaLayout media={<Avatar image={{ alt: 'avatar' }} />} description="with description">
          folder 0 child {i}
        </TreeItemPersonaLayout>
      ),
      height: 56,
    })),
  },
  {
    value: 'folder 1',
    children: <TreeItemLayout>folder 1</TreeItemLayout>,
    height: 32,
    subtree: [
      ...Array.from({ length: 20 }, (_, i) => ({
        value: `folder 1 sub-folder ${i}`,
        children: <TreeItemLayout>folder 1 sub-folder {i}</TreeItemLayout>,
        height: 32,
        subtree: Array.from({ length: 10 }, (_, j) => ({
          value: `folder 1 sub-folder ${i} child ${j}`,
          children: (
            <TreeItemPersonaLayout media={<Avatar image={{ alt: 'avatar' }} />} description="with description">
              folder 1 sub-folder {i} child {j}
            </TreeItemPersonaLayout>
          ),
          height: 56,
        })),
      })),
    ],
  },
  {
    value: 'folder 2',
    children: <TreeItemLayout>folder 2</TreeItemLayout>,
    height: 32,
    subtree: Array.from({ length: 30 }, (_, i) => ({
      value: `folder 2 child ${i}`,
      children: (
        <TreeItemPersonaLayout media={<Avatar image={{ alt: 'avatar' }} />} description="with description">
          folder 2 child {i}
        </TreeItemPersonaLayout>
      ),
      height: 56,
    })),
  },
];
const flatTreeItems = flattenTree_unstable(allItemsNested);

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContainer: {
    height: '600px',
    overflowY: 'auto',
    boxSizing: 'border-box',
    ...shorthands.border(tokens.strokeWidthThicker, 'solid', tokens.colorNeutralForeground3),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.border(tokens.strokeWidthThicker, 'solid', tokens.colorNeutralForeground3),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),

    marginTop: '20px',
    ...shorthands.padding('10px'),
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  tree: {
    position: 'relative',
    width: '100%',
  },
});

const DURATION = 200;

const Fade = createPresenceComponent({
  enter: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    duration: DURATION,
  },
  exit: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    duration: DURATION,
  },
});

const AnimatedFlatTreeItem: ForwardRefComponent<
  Partial<TreeItemProps> & {
    top: number;
    playbackRate: number;
    rendersInVirtual: boolean;
  }
> = React.forwardRef((props, ref) => {
  const { top, playbackRate, rendersInVirtual, ...rest } = props;
  const visible = top !== -1;

  const prevTop = usePrevious(top);
  const prevTreeItemProps = usePrevious(rest);

  // Heads up!
  // This is optional and is intended solely to slow down the animations, making motions more visible in the examples.
  const motionRef = React.useRef<MotionImperativeRef>();
  React.useEffect(() => {
    motionRef.current?.setPlaybackRate(playbackRate / 100);
  }, [playbackRate, visible]);

  const treeItemRef = React.useRef<HTMLDivElement>(null);

  const [slideAnimationFinished, setSlideAnimationFinished] = React.useState<boolean>(false);

  const slideAnimationKeyframes: Keyframe[] | null = React.useMemo(
    () =>
      visible && prevTop !== null && prevTop >= 0 && prevTop !== top
        ? [{ top: `${prevTop}px` }, { top: `${top}px` }]
        : null,
    [visible, prevTop, top],
  );

  useIsomorphicLayoutEffect(() => {
    if (slideAnimationKeyframes && treeItemRef.current) {
      const slideAnimation = treeItemRef.current.animate(slideAnimationKeyframes, {
        duration: DURATION / (playbackRate / 100),
        fill: 'forwards',
        // TODO isReducedMotion check
      });
      slideAnimation.onfinish = () => {
        setSlideAnimationFinished(true);
      };
    } else {
      setSlideAnimationFinished(false);
    }
  }, [slideAnimationKeyframes, DURATION, playbackRate]);

  let renders = true;
  if (
    visible &&
    !rendersInVirtual &&
    (!slideAnimationKeyframes || // no slide animation is needed, unmount since it's rendersInVirtual is false
      slideAnimationFinished) // slide animation is finished, need to unmount
  ) {
    renders = false;
  }

  // TODO optimization: if an item becomes visible but does not render in virtual list, and it has slideAnimation. We can check the top position of the slide animation, if it is outside of the view port, no need to mount it at all.
  // repro: expand folder 0, and use button to expand subfolders in folder 1, everything happens outside of viewport, no need to mount anything extra.

  return renders ? (
    <Fade visible={visible} unmountOnExit imperativeRef={motionRef}>
      <TreeItem
        ref={treeItemRef}
        {...(visible ? rest : prevTreeItemProps)}
        itemType={rest.itemType ?? 'leaf'}
        style={{
          ...props.style,
          position: 'absolute',
          width: '100%',
          top: `${top}px`,
          // transition: `top ${DURATION / (playbackRate / 100)}ms`,
          // before unmount, keep it as is and fade out
          ...(!visible &&
            prevTop !== null &&
            prevTop >= 0 && {
              top: `${prevTop}px`,
            }),
        }}
      />
    </Fade>
  ) : null;
});

const Controls = ({
  setOpenItems,
  playbackRate,
  setPlaybackRate,
}: {
  setOpenItems: React.Dispatch<React.SetStateAction<Set<TreeItemValue>>>;
  playbackRate: number;
  setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const styles = useStyles();

  const expandFolders = () => {
    setOpenItems(
      prevOpenItems =>
        new Set([...prevOpenItems, ...flatTreeItems.filter(item => item['aria-level'] === 1).map(item => item.value)]),
    );
  };
  const collapseFolders = () => {
    setOpenItems(prevOpenItems => {
      const nextOpenItems = new Set(prevOpenItems);
      flatTreeItems
        .filter(item => item['aria-level'] === 1)
        .forEach(item => {
          nextOpenItems.delete(item.value);
        });
      return nextOpenItems;
    });
  };

  const expandFolder1SubFolders = () => {
    setOpenItems(
      prevOpenItems =>
        new Set([
          ...prevOpenItems,
          'folder 1',
          ...flatTreeItems.filter(item => item.parentValue === 'folder 1').map(item => item.value),
        ]),
    );
  };
  const collapseFolder1SubFolders = () => {
    setOpenItems(prevOpenItems => {
      const nextOpenItems = new Set(prevOpenItems);
      flatTreeItems
        .filter(item => item.parentValue === 'folder 1')
        .forEach(item => {
          nextOpenItems.delete(item.value);
        });
      return nextOpenItems;
    });
  };

  const sliderId = useId();

  return (
    <div className={styles.controls}>
      <Checkbox
        label={<code>expand folders</code>}
        onChange={(_, data) => {
          if (data.checked) {
            expandFolders();
          } else {
            collapseFolders();
          }
        }}
      />
      <Checkbox
        label={<code>expand sub folders in folder 1</code>}
        onChange={(_, data) => {
          if (data.checked) {
            expandFolder1SubFolders();
          } else {
            collapseFolder1SubFolders();
          }
        }}
      />
      <div className={styles.sliderContainer}>
        <Label htmlFor={sliderId}>
          <code>playbackRate</code>: {playbackRate}%
        </Label>
        <Slider
          aria-valuetext={`Value is ${playbackRate}%`}
          value={playbackRate}
          onChange={(_ev, data) => setPlaybackRate(data.value)}
          min={0}
          id={sliderId}
          max={100}
          step={10}
        />
      </div>
    </div>
  );
};

function useHeadlessFlatVirtualizedTree<Props extends HeadlessFlatTreeItemProps>(
  props: Props[],
  {
    virtualizerOptions,
    getItemSize,
    ...options
  }: HeadlessFlatTreeOptions & {
    virtualizerOptions: Omit<Parameters<typeof useVirtualizer>[0], 'count' | 'estimateSize'>;
    getItemSize: (index: number) => number;
  },
): HeadlessFlatTree<Props> &
  Omit<ReturnType<typeof useVirtualizer>, 'getVirtualItems'> & {
    getVirtualItems: () => (HeadlessFlatTreeItem<Props> & {
      virtualItemProps: Pick<VirtualItem, 'size' | 'start'>;
    })[];
  } {
  const headlessTree = useHeadlessFlatTree_unstable(props, options);

  const items = React.useMemo(() => Array.from(headlessTree.items()), [headlessTree]);

  const estimateSize = React.useCallback(
    (index: number) => getItemSize(props.findIndex((item, _) => item.value === items[index].value)),
    [getItemSize, props, items],
  );

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    estimateSize,
    ...virtualizerOptions,
  });

  const baseGetVirtualItems = rowVirtualizer.getVirtualItems;
  const getVirtualItems = React.useCallback(
    () =>
      baseGetVirtualItems().map(virtualItem => ({
        virtualItemProps: { size: virtualItem.size, start: virtualItem.start },
        ...items[virtualItem.index],
      })),
    [baseGetVirtualItems, items],
  );

  /**
   * Since navigation is not possible due to the fact that not all items are rendered,
   * we need to scroll to the next item and then invoke navigation.
   */
  const handleNavigation = useEventCallback(
    (event: TreeNavigationEvent_unstable, data: TreeNavigationData_unstable) => {
      const nextItem = headlessTree.getNextNavigableItem(items, data);
      if (!nextItem) {
        return;
      }
      // if the next item is not rendered, scroll to it and try to navigate again
      if (!headlessTree.getElementFromItem(nextItem)) {
        event.preventDefault(); // preventing default disables internal navigation.
        rowVirtualizer.scrollToIndex(nextItem.index);
        // waiting for the next animation frame to allow the list to be scrolled
        return requestAnimationFrame(() => headlessTree.navigate(data));
      }
    },
  );

  const baseGetTreeProps = headlessTree.getTreeProps;
  const getTreeProps = React.useCallback(
    () => ({
      ...baseGetTreeProps(),
      onNavigation: handleNavigation,
    }),
    [baseGetTreeProps, handleNavigation],
  );

  return {
    ...headlessTree,
    getTreeProps,
    ...rowVirtualizer,
    getVirtualItems,
  };
}

export const FlatVirtualizedTreeAnimation = () => {
  const styles = useStyles();

  const [openItems, setOpenItems] = React.useState<Set<TreeItemValue>>(new Set());
  const handleOpenItemsChange: HeadlessFlatTreeOptions['onOpenChange'] = (_event, data) => {
    setOpenItems(data.openItems);
  };

  const getItemSize = (index: number): number => {
    const item = flatTreeItems[index];
    return item.height;
  };

  const parentRef = React.useRef<HTMLDivElement>(null);
  const flatTree = useHeadlessFlatVirtualizedTree(flatTreeItems, {
    openItems,
    onOpenChange: handleOpenItemsChange,
    getItemSize,
    virtualizerOptions: {
      getScrollElement: () => parentRef.current,
    },
  });

  const visibleItems = Array.from(flatTree.items());

  const virtualItems = flatTree.getVirtualItems();

  const [playbackRate, setPlaybackRate] = React.useState<number>(10);

  const getItemTop = (index: number): number => {
    // height of all items before this item
    return visibleItems.slice(0, index).reduce((acc, item) => acc + item.getTreeItemProps().height, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer} ref={parentRef}>
        {virtualItems.length && (
          <FlatTree
            {...flatTree.getTreeProps()}
            aria-label="Flat Tree"
            className={styles.tree}
            style={{ height: `${flatTree.getTotalSize()}px` }}
          >
            {flatTreeItems.map(flatTreeItem => {
              const visibleItem = visibleItems.find(item => item.value === flatTreeItem.value);
              const treeItemProps = visibleItem?.getTreeItemProps?.();

              const virtualItem = virtualItems.find(item => item.value === flatTreeItem.value);

              return (
                <AnimatedFlatTreeItem
                  {...treeItemProps}
                  key={flatTreeItem.value}
                  value={flatTreeItem.value}
                  top={visibleItem ? getItemTop(visibleItem.index) : -1}
                  playbackRate={playbackRate}
                  rendersInVirtual={!!virtualItem}
                />
              );
            })}
          </FlatTree>
        )}
      </div>
      <Controls setOpenItems={setOpenItems} playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />
    </div>
  );
};
