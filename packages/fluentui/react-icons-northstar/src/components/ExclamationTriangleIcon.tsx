import * as React from 'react';
import cx from 'classnames';
import { createSvgIcon } from '../utils/createSvgIcon';
import { iconClassNames } from '../utils/iconClassNames';

export const ExclamationTriangleIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg role="presentation" focusable="false" className={classes.svg} viewBox="0 0 20 20">
      <g className={cx(iconClassNames.outline, classes.outlinePart)}>
        <path d="M9.99835 7C10.2745 7 10.4984 7.22386 10.4984 7.5V11.5C10.4984 11.7761 10.2745 12 9.99835 12C9.72221 12 9.49835 11.7761 9.49835 11.5V7.5C9.49835 7.22386 9.72221 7 9.99835 7Z" />
        <path d="M9.99835 14.5C10.4126 14.5 10.7484 14.1642 10.7484 13.75C10.7484 13.3358 10.4126 13 9.99835 13C9.58414 13 9.24835 13.3358 9.24835 13.75C9.24835 14.1642 9.58414 14.5 9.99835 14.5Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.68404 2.85216C9.25393 1.816 10.7428 1.81599 11.3127 2.85216L17.8714 14.7771C18.4212 15.7768 17.698 17 16.5571 17H3.43964C2.29873 17 1.57549 15.7768 2.12531 14.7771L8.68404 2.85216ZM10.4365 3.33407C10.2465 2.98869 9.75022 2.98869 9.56026 3.33408L3.00153 15.259C2.81825 15.5923 3.05933 16 3.43964 16H16.5571C16.9374 16 17.1785 15.5923 16.9952 15.259L10.4365 3.33407Z"
        />
      </g>
      <path
        className={cx(iconClassNames.filled, classes.filledPart)}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.68404 2.85216C9.25393 1.816 10.7428 1.81599 11.3127 2.85216L17.8714 14.7771C18.4212 15.7768 17.698 17 16.5571 17H3.43964C2.29873 17 1.57549 15.7768 2.12531 14.7771L8.68404 2.85216ZM9.99835 6.75C10.4126 6.75 10.7484 7.08579 10.7484 7.5V11.5C10.7484 11.9142 10.4126 12.25 9.99835 12.25C9.58414 12.25 9.24835 11.9142 9.24835 11.5V7.5C9.24835 7.08579 9.58414 6.75 9.99835 6.75ZM10.7484 13.75C10.7484 14.1642 10.4126 14.5 9.99835 14.5C9.58414 14.5 9.24835 14.1642 9.24835 13.75C9.24835 13.3358 9.58414 13 9.99835 13C10.4126 13 10.7484 13.3358 10.7484 13.75Z"
      />
    </svg>
  ),
  displayName: 'ExclamationTriangleIcon',
});
