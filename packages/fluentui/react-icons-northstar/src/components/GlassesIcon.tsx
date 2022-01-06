import * as React from 'react';
import cx from 'classnames';
import { createSvgIcon } from '../utils/createSvgIcon';
import { iconClassNames } from '../utils/iconClassNames';

export const GlassesIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg role="presentation" focusable="false" viewBox="0 0 20 20" className={classes.svg}>
      <g className={cx(iconClassNames.outline, classes.outlinePart)}>
        <path d="M7.18603 4C6.60508 4 6.05284 4.2526 5.67294 4.69212L2.36157 8.52303C2.13613 8.78548 2 9.12688 2 9.5V12.5C2 13.8807 3.11929 15 4.5 15H6.5C7.88071 15 9 13.8807 9 12.5V11H11V12.5C11 13.8807 12.1193 15 13.5 15H15.5C16.8807 15 18 13.8807 18 12.5V9.5C18 9.07146 17.8203 8.6849 17.5321 8.41155L14.3274 4.69412C13.9475 4.25341 13.3945 4 12.8126 4H12C11.7238 4 11.5 4.22386 11.5 4.5C11.5 4.77614 11.7238 5 12 5H12.8126C13.1036 5 13.3801 5.1267 13.57 5.34706L15.8571 8H12.5C11.6716 8 11 8.67157 11 9.5V10H9V9.5C9 8.67157 8.32843 8 7.5 8H4.13547L6.42948 5.34606C6.61943 5.1263 6.89555 5 7.18603 5H7.99985C8.276 5 8.49985 4.77614 8.49985 4.5C8.49985 4.22386 8.276 4 7.99985 4H7.18603ZM8 9.5V12.5C8 13.3284 7.32843 14 6.5 14H4.5C3.67157 14 3 13.3284 3 12.5V9.5C3 9.22386 3.22386 9 3.5 9H7.5C7.77614 9 8 9.22386 8 9.5ZM12 12.5V9.5C12 9.22386 12.2239 9 12.5 9H16.5C16.62 9 16.7302 9.04229 16.8163 9.11278L16.8713 9.17647L16.877 9.17153C16.9536 9.25939 17 9.37427 17 9.5V12.5C17 13.3284 16.3284 14 15.5 14H13.5C12.6716 14 12 13.3284 12 12.5Z" />
      </g>
      <g className={cx(iconClassNames.filled, classes.filledPart)}>
        <path d="M7.18627 4C6.60533 4 6.05309 4.2526 5.67318 4.69212L2.37321 8.50985C2.14089 8.77402 2 9.12055 2 9.5V12.5C2 13.8807 3.11929 15 4.5 15H6.5C7.88071 15 9 13.8807 9 12.5V11H11V12.5C11 13.8807 12.1193 15 13.5 15H15.5C16.8807 15 18 13.8807 18 12.5V9.5C18 9.07146 17.8203 8.6849 17.5321 8.41155L14.3274 4.69412C13.9475 4.25341 13.3945 4 12.8126 4H12C11.7238 4 11.5 4.22386 11.5 4.5C11.5 4.77614 11.7238 5 12 5H12.8126C13.1036 5 13.3801 5.1267 13.57 5.34706L15.8571 8H12.5C11.6716 8 11 8.67157 11 9.5V10H9V9.5C9 8.67157 8.32843 8 7.5 8H4.13571L6.42973 5.34606C6.61968 5.1263 6.8958 5 7.18627 5H8.0001C8.27624 5 8.5001 4.77614 8.5001 4.5C8.5001 4.22386 8.27624 4 8.0001 4H7.18627Z" />
      </g>
    </svg>
  ),
  displayName: 'GlassesIcon',
});
