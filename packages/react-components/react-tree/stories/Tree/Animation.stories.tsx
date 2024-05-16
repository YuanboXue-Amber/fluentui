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
} from '@fluentui/react-components';
import { MotionImperativeRef, createPresenceComponent } from '@fluentui/react-motions-preview';
import { useId, usePrevious } from '@fluentui/react-utilities';

const allItemsNested: FlattenTreeItem<TreeItemProps>[] = [
  {
    value: 'folder 0',
    children: <TreeItemLayout>folder 0</TreeItemLayout>,
    subtree: Array.from({ length: 7 }, (_, i) => ({
      value: `folder 0 child ${i}`,
      children: <TreeItemLayout>folder 0 child {i}</TreeItemLayout>,
    })),
  },
  {
    value: 'folder 1',
    children: <TreeItemLayout>folder 1</TreeItemLayout>,
    subtree: [
      ...Array.from({ length: 6 }, (_, i) => ({
        value: `folder 1 sub-folder ${i}`,
        children: <TreeItemLayout>folder 1 sub-folder {i}</TreeItemLayout>,
        subtree: Array.from({ length: 2 }, (_, j) => ({
          value: `folder 1 sub-folder ${i} child ${j}`,
          children: (
            <TreeItemLayout>
              folder 1 sub-folder {i} child {j}
            </TreeItemLayout>
          ),
        })),
      })),
    ],
  },
  {
    value: 'folder 2',
    children: <TreeItemLayout>folder 2</TreeItemLayout>,
    subtree: Array.from({ length: 3 }, (_, i) => ({
      value: `folder 2 child ${i}`,
      children: <TreeItemLayout>folder 2 child {i}</TreeItemLayout>,
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
    height: '800px',
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

const ITEM_HEIGHT = 32;

const AnimatedFlatTreeItem: ForwardRefComponent<
  Partial<TreeItemProps> & {
    index: number;
    playbackRate: number;
  }
> = React.forwardRef((props, ref) => {
  const { index, playbackRate, ...rest } = props;
  const visible = index !== -1;

  const prevIndex = usePrevious(index);
  const prevTreeItemProps = usePrevious(rest);

  // Heads up!
  // This is optional and is intended solely to slow down the animations, making motions more visible in the examples.
  const motionRef = React.useRef<MotionImperativeRef>();
  React.useEffect(() => {
    motionRef.current?.setPlaybackRate(playbackRate / 100);
  }, [playbackRate, visible]);

  return (
    <Fade visible={visible} unmountOnExit imperativeRef={motionRef}>
      <TreeItem
        {...(visible ? rest : prevTreeItemProps)}
        itemType={rest.itemType ?? 'leaf'}
        style={{
          ...props.style,
          position: 'absolute',
          width: '100%',
          top: `${index * ITEM_HEIGHT}px`,
          transition: `top ${DURATION / (playbackRate / 100)}ms`,
          // before unmount, keep it as is and fade out
          ...(!visible &&
            prevIndex !== null &&
            prevIndex >= 0 && {
              top: `${prevIndex * ITEM_HEIGHT}px`,
            }),
        }}
      />
    </Fade>
  );
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

export const AnimationExample = () => {
  const styles = useStyles();

  const [openItems, setOpenItems] = React.useState<Set<TreeItemValue>>(new Set());
  const handleOpenItemsChange: HeadlessFlatTreeOptions['onOpenChange'] = (_event, data) => {
    setOpenItems(data.openItems);
  };
  const flatTree = useHeadlessFlatTree_unstable(flatTreeItems, {
    openItems,
    onOpenChange: handleOpenItemsChange,
  });
  const visibleItems = Array.from(flatTree.items());

  const [playbackRate, setPlaybackRate] = React.useState<number>(10);

  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer}>
        <FlatTree {...flatTree.getTreeProps()} aria-label="Flat Tree" className={styles.tree}>
          {flatTreeItems.map(flatTreeItem => {
            const visibleItem = visibleItems.find(item => item.value === flatTreeItem.value);
            const treeItemProps = visibleItem?.getTreeItemProps();
            return (
              <AnimatedFlatTreeItem
                {...treeItemProps}
                index={visibleItem ? visibleItem.index : -1}
                playbackRate={playbackRate}
              />
            );
          })}
        </FlatTree>
      </div>
      <Controls setOpenItems={setOpenItems} playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />
    </div>
  );
};
