import { makeStyles, mergeClasses, shorthands } from '@griffel/react';
import type { TagSlots, TagState } from './Tag.types';
import type { SlotClassNames } from '@fluentui/react-utilities';
import { tokens, typographyStyles } from '@fluentui/react-theme';

export const tagClassNames: SlotClassNames<TagSlots> = {
  root: 'fui-Tag',
  content: 'fui-Tag__content',
  media: 'fui-Tag__media',
  icon: 'fui-Tag__icon',
  primaryText: 'fui-Tag__primaryText',
  secondaryText: 'fui-Tag__secondaryText',
  dismissButton: 'fui-Tag__dismissButton',
};

/**
 * Styles for the root slot
 */
const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    height: '32px',
    width: 'fit-content',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),

    ...shorthands.outline('1px', 'solid', 'red'),

    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
  },
  rootCircular: {
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },

  media: {
    alignSelf: 'center',
    paddingLeft: tokens.spacingHorizontalXXS,
    paddingRight: tokens.spacingHorizontalS,
  },

  content: {
    display: 'inline-grid',
    gridTemplateRows: '1fr auto auto 1fr',
    gridTemplateAreas: `
    "icon .        "
    "icon primary  "
    "icon secondary"
    "icon .        "
    `,
    paddingRight: tokens.spacingHorizontalS,
  },
  textOnlyContent: {
    paddingLeft: tokens.spacingHorizontalS,
  },
  dismissableContent: {
    paddingRight: '2px',
  },

  icon: {
    display: 'flex',
    alignSelf: 'center',
    ...shorthands.gridArea('icon'),
    paddingLeft: '6px',
    paddingRight: '2px',
  },
  primaryText: {
    gridColumnStart: 'primary',
    gridRowStart: 'primary',
    gridRowEnd: 'secondary',
    ...typographyStyles.body1,
    paddingLeft: tokens.spacingHorizontalXXS,
    paddingRight: tokens.spacingHorizontalXXS,
  },
  primaryTextWithSecondaryText: {
    ...shorthands.gridArea('primary'),
    ...typographyStyles.caption1,
  },
  secondaryText: {
    ...shorthands.gridArea('secondary'),
    paddingLeft: tokens.spacingHorizontalXXS,
    paddingRight: tokens.spacingHorizontalXXS,
    ...typographyStyles.caption2,
  },

  dismissButton: {
    ...shorthands.padding('0px'),
    marginRight: '6px',
    minWidth: '20px',
  },
  content: {
    display: 'inline-grid',
    gridTemplateColumns: 'auto 8px auto auto 8px auto',
    gridTemplateRows: '1fr auto auto 1fr',
    gridTemplateAreas: `
    "avatar . icon .         ."
    "avatar . icon primary   ."
    "avatar . icon secondary ."
    "avatar . icon .         ."
    `,
  },
  avatar: {
    alignSelf: 'center',
    ...shorthands.gridArea('avatar'),
  },
  icon: {
    alignSelf: 'center',
    ...shorthands.gridArea('icon'),
  },
  primaryText: { ...shorthands.gridArea('primary') },
  secondaryText: { ...shorthands.gridArea('secondary') },
  dismissButton: {},

  // TODO add additional classes for different states and/or slots
});

/**
 * Apply styling to the Tag slots based on the state
 */
export const useTagStyles_unstable = (state: TagState): TagState => {
  const styles = useStyles();
  state.root.className = mergeClasses(
    tagClassNames.root,
    styles.root,
    state.shape === 'circular' && styles.rootCircular,
    state.root.className,
  );
  if (state.content) {
    state.content.className = mergeClasses(
      tagClassNames.content,
      styles.content,
      !state.media && !state.icon && styles.textOnlyContent,
      state.dismissButton && styles.dismissableContent,
      state.content.className,
    );
  }

  if (state.media) {
    state.media.className = mergeClasses(tagClassNames.media, styles.media, state.media.className);
  }
  if (state.icon) {
    state.icon.className = mergeClasses(tagClassNames.icon, styles.icon, state.icon.className);
  }
  if (state.primaryText) {
    state.primaryText.className = mergeClasses(
      tagClassNames.primaryText,
      styles.primaryText,
      state.secondaryText && styles.primaryTextWithSecondaryText,
      state.primaryText.className,
    );
  }
  if (state.secondaryText) {
    state.secondaryText.className = mergeClasses(
      tagClassNames.secondaryText,
      styles.secondaryText,
      state.secondaryText.className,
    );
  }
  if (state.dismissButton) {
    state.dismissButton.className = mergeClasses(
      tagClassNames.dismissButton,
      styles.dismissButton,
      state.dismissButton.className,
    );
  }

  return state;
};
