import * as React from 'react';
import cx from 'classnames';
import { createSvgIcon } from '../utils/createSvgIcon';
import { iconClassNames } from '../utils/iconClassNames';

export const TableDeleteIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg
      style={{ overflow: 'visible' }}
      role="presentation"
      focusable="false"
      viewBox="0 0 20 20"
      className={classes.svg}
    >
      <g className={cx(iconClassNames.outline, classes.outlinePart)}>
        <path d="M17 5.5C17 4.11929 15.8807 3 14.5 3H5.5C4.11929 3 3 4.11929 3 5.5V14.5C3 15.8807 4.11929 17 5.5 17H9.59971C9.43777 16.6832 9.30564 16.3486 9.20703 16H8V13H9.20703C9.30564 12.6514 9.43777 12.3168 9.59971 12H8V8H12V9.59971C12.3168 9.43777 12.6514 9.30564 13 9.20703V8H16V9.20703C16.3486 9.30564 16.6832 9.43777 17 9.59971V5.5ZM4 14.5V13H7V16H5.5L5.35554 15.9931C4.59489 15.9204 4 15.2797 4 14.5ZM12 4V7H8V4H12ZM13 4H14.5L14.6445 4.00687C15.4051 4.07955 16 4.7203 16 5.5V7H13V4ZM7 4V7H4V5.5L4.00687 5.35554C4.07955 4.59489 4.7203 4 5.5 4H7ZM7 8V12H4V8H7Z" />
        <path d="M19 14.5C19 16.9853 16.9853 19 14.5 19C12.0147 19 10 16.9853 10 14.5C10 12.0147 12.0147 10 14.5 10C16.9853 10 19 12.0147 19 14.5ZM15.2071 14.5L16.3536 13.3536C16.5488 13.1583 16.5488 12.8417 16.3536 12.6464C16.1583 12.4512 15.8417 12.4512 15.6464 12.6464L14.5 13.7929L13.3536 12.6464C13.1583 12.4512 12.8417 12.4512 12.6464 12.6464C12.4512 12.8417 12.4512 13.1583 12.6464 13.3536L13.7929 14.5L12.6464 15.6464C12.4512 15.8417 12.4512 16.1583 12.6464 16.3536C12.8417 16.5488 13.1583 16.5488 13.3536 16.3536L14.5 15.2071L15.6464 16.3536C15.8417 16.5488 16.1583 16.5488 16.3536 16.3536C16.5488 16.1583 16.5488 15.8417 16.3536 15.6464L15.2071 14.5Z" />
      </g>
      <g className={cx(iconClassNames.filled, classes.filledPart)}>
        <path d="M13 7H17V5.5C17 4.11929 15.8807 3 14.5 3H13V7Z" />
        <path d="M7 12V8H3V12H7Z" />
        <path d="M9.59971 12C10.1266 10.9692 10.9692 10.1266 12 9.59971V8H8V12H9.59971Z" />
        <path d="M14.5 9C15.4002 9 16.2499 9.21628 17 9.59971V8H13V9.20703C13.4768 9.07217 13.98 9 14.5 9Z" />
        <path d="M9 14.5C9 13.98 9.07217 13.4768 9.20703 13H8V17H9.59971C9.21628 16.2499 9 15.4002 9 14.5Z" />
        <path d="M7 13H3V14.5C3 15.8807 4.11929 17 5.5 17H7V13Z" />
        <path d="M12 7V3H8V7H12Z" />
        <path d="M7 3V7H3V5.5C3 4.11929 4.11929 3 5.5 3H7Z" />
        <path d="M19 14.5C19 16.9853 16.9853 19 14.5 19C12.0147 19 10 16.9853 10 14.5C10 12.0147 12.0147 10 14.5 10C16.9853 10 19 12.0147 19 14.5ZM15.2071 14.5L16.3536 13.3536C16.5488 13.1583 16.5488 12.8417 16.3536 12.6464C16.1583 12.4512 15.8417 12.4512 15.6464 12.6464L14.5 13.7929L13.3536 12.6464C13.1583 12.4512 12.8417 12.4512 12.6464 12.6464C12.4512 12.8417 12.4512 13.1583 12.6464 13.3536L13.7929 14.5L12.6464 15.6464C12.4512 15.8417 12.4512 16.1583 12.6464 16.3536C12.8417 16.5488 13.1583 16.5488 13.3536 16.3536L14.5 15.2071L15.6464 16.3536C15.8417 16.5488 16.1583 16.5488 16.3536 16.3536C16.5488 16.1583 16.5488 15.8417 16.3536 15.6464L15.2071 14.5Z" />
      </g>
    </svg>
  ),
  displayName: 'TableDeleteIcon',
});
