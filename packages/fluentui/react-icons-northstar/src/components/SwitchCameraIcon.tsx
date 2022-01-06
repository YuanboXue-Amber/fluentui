import * as React from 'react';
import cx from 'classnames';
import { createSvgIcon } from '../utils/createSvgIcon';
import { iconClassNames } from '../utils/iconClassNames';

export const SwitchCameraIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg className={classes.svg} viewBox="0 0 20 20" role="presentation" focusable="false">
      <g className={cx(iconClassNames.outline, classes.outlinePart)}>
        <path d="M4 4.5C4 3.11929 5.11929 2 6.5 2H11.5C12.8807 2 14 3.11929 14 4.5V5.11308L15.8911 4.08241C16.3909 3.81003 17 4.17178 17 4.74096V9.25907C17 9.82825 16.3909 10.19 15.8911 9.91762L14 8.88695V9.5C14 10.8807 12.8807 12 11.5 12H6.5C5.11929 12 4 10.8807 4 9.5V4.5ZM14 7.74808L16 8.8381V5.16193L14 6.25195V7.74808ZM6.5 3C5.67157 3 5 3.67157 5 4.5V9.5C5 10.3284 5.67157 11 6.5 11H11.5C12.3284 11 13 10.3284 13 9.5V4.5C13 3.67157 12.3284 3 11.5 3H6.5Z" />
        <path d="M3.66913 11.8888C3.34616 12.0121 3.06056 12.1486 2.82273 12.2986C2.40763 12.5603 2 12.9537 2 13.5C2 14.0463 2.40763 14.4397 2.82273 14.7014C3.26283 14.9789 3.86646 15.2103 4.56787 15.3973C5.97801 15.7734 7.89836 16 10 16C10.0985 16 10.1967 15.9995 10.2944 15.9985L9.14645 17.1464C8.95118 17.3417 8.95118 17.6583 9.14645 17.8536C9.34171 18.0488 9.65829 18.0488 9.85355 17.8536L11.8536 15.8536C12.0488 15.6583 12.0488 15.3417 11.8536 15.1464L9.85355 13.1464C9.65829 12.9512 9.34171 12.9512 9.14645 13.1464C8.95118 13.3417 8.95118 13.6583 9.14645 13.8536L10.2914 14.9985C10.1948 14.9995 10.0976 15 10 15C7.95951 15 6.12986 14.7789 4.82553 14.4311C4.16971 14.2562 3.67499 14.0566 3.35605 13.8555C3.0121 13.6387 3 13.506 3 13.5C3 13.494 3.0121 13.3613 3.35605 13.1445C3.63272 12.97 4.04166 12.7967 4.57329 12.6397C4.22446 12.4508 3.9173 12.1947 3.66913 11.8888Z" />
        <path d="M13.9238 12.3021C14.2165 12.0572 14.4618 11.7575 14.6439 11.4188C14.9212 11.4752 15.1845 11.5366 15.4321 11.6027C16.1335 11.7897 16.7372 12.0211 17.1773 12.2986C17.5924 12.5603 18 12.9537 18 13.5C18 14.0463 17.5924 14.4397 17.1773 14.7014C16.7372 14.9789 16.1335 15.2103 15.4321 15.3973C15.1661 15.4683 14.882 15.5339 14.5819 15.5937C14.278 15.6542 14 15.4175 14 15.1076C14 14.8633 14.176 14.6553 14.4155 14.6071C14.6845 14.553 14.9381 14.4941 15.1745 14.4311C15.8303 14.2562 16.325 14.0566 16.644 13.8555C16.9879 13.6387 17 13.506 17 13.5C17 13.494 16.9879 13.3613 16.644 13.1445C16.325 12.9434 15.8303 12.7438 15.1745 12.5689C14.7987 12.4687 14.3793 12.379 13.9238 12.3021Z" />
      </g>
      <g className={cx(iconClassNames.filled, classes.filledPart)}>
        <path d="M6.5 2C5.11929 2 4 3.11929 4 4.5V9.5C4 10.8807 5.11929 12 6.5 12H10.5C11.8807 12 13 10.8807 13 9.5V4.5C13 3.11929 11.8807 2 10.5 2H6.5Z" />
        <path d="M15.8911 9.91759L14 8.88693V5.11304L15.8911 4.08238C16.3909 3.81 17 4.17175 17 4.74093V9.25904C17 9.82822 16.3909 10.19 15.8911 9.91759Z" />
        <path d="M3.66913 11.8888C3.34616 12.0121 3.06056 12.1486 2.82273 12.2986C2.40763 12.5603 2 12.9537 2 13.5C2 14.0463 2.40763 14.4397 2.82273 14.7014C3.26283 14.9789 3.86646 15.2103 4.56787 15.3973C5.97801 15.7734 7.89836 16 10 16C10.0985 16 10.1967 15.9995 10.2944 15.9985L9.14645 17.1464C8.95118 17.3417 8.95118 17.6583 9.14645 17.8536C9.34171 18.0488 9.65829 18.0488 9.85355 17.8536L11.8536 15.8536C12.0488 15.6583 12.0488 15.3417 11.8536 15.1464L9.85355 13.1464C9.65829 12.9512 9.34171 12.9512 9.14645 13.1464C8.95118 13.3417 8.95118 13.6583 9.14645 13.8536L10.2914 14.9985C10.1948 14.9995 10.0976 15 10 15C7.95951 15 6.12986 14.7789 4.82553 14.4311C4.16971 14.2562 3.67499 14.0566 3.35605 13.8555C3.0121 13.6387 3 13.506 3 13.5C3 13.494 3.0121 13.3613 3.35605 13.1445C3.63272 12.97 4.04166 12.7967 4.57329 12.6397C4.22446 12.4508 3.9173 12.1947 3.66913 11.8888Z" />
        <path d="M13.0636 12.1776C13.3381 11.9173 13.5635 11.6056 13.7243 11.258C14.3496 11.3511 14.924 11.4672 15.4321 11.6027C16.1335 11.7897 16.7372 12.0211 17.1773 12.2986C17.5924 12.5603 18 12.9537 18 13.5C18 14.0463 17.5924 14.4397 17.1773 14.7014C16.7372 14.9789 16.1335 15.2103 15.4321 15.3973C15.1661 15.4683 14.882 15.5339 14.5819 15.5937C14.278 15.6542 14 15.4175 14 15.1076C14 14.8633 14.176 14.6553 14.4155 14.6071C14.6845 14.553 14.9381 14.4941 15.1745 14.4311C15.8303 14.2562 16.325 14.0566 16.644 13.8555C16.9879 13.6387 17 13.506 17 13.5C17 13.494 16.9879 13.3613 16.644 13.1445C16.325 12.9434 15.8303 12.7438 15.1745 12.5689C14.5724 12.4084 13.8585 12.2748 13.0636 12.1776Z" />
      </g>
    </svg>
  ),
  displayName: 'SwitchCameraIcon',
});
