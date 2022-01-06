import * as React from 'react';
import cx from 'classnames';
import { createSvgIcon } from '../utils/createSvgIcon';
import { iconClassNames } from '../utils/iconClassNames';

export const NoPresenterIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg role="presentation" focusable="false" viewBox="0 0 20 20" className={classes.svg}>
      <g className={cx(iconClassNames.filled, classes.filledPart)}>
        <path d="M7.14618 7.8533C7.05247 8.04912 7 8.26843 7 8.5V9H8.29288L9.29288 10H3.49051C3.04042 10 2.8195 10.5482 3.14379 10.8603L6.84664 14.4239C6.94458 14.5182 6.99993 14.6482 6.99993 14.7842V16.5C6.99993 17.3284 7.6715 18 8.49993 18H11.4999C12.3284 18 12.9999 17.3284 12.9999 16.5V14.7842C12.9999 14.6482 13.0553 14.5182 13.1532 14.4239L13.4404 14.1475L17.1464 17.8536C17.3417 18.0488 17.6583 18.0488 17.8536 17.8536C18.0488 17.6583 18.0488 17.3417 17.8536 17.1465L7.8533 7.14618C7.85331 7.14618 7.8533 7.14618 7.8533 7.14618L2.85355 2.14646C2.65829 1.9512 2.34171 1.9512 2.14645 2.14646C1.95118 2.34172 1.95118 2.65831 2.14645 2.85357L7.14618 7.8533Z" />
        <path d="M16.8561 10.8603L14.8817 12.7604L12.1213 10H16.5093C16.9594 10 17.1804 10.5482 16.8561 10.8603Z" />
        <path d="M13 9H11.1213L9.12134 7H11.5C12.3284 7 13 7.67157 13 8.5V9Z" />
        <path d="M10 6C11.1046 6 12 5.10457 12 4C12 2.89543 11.1046 2 10 2C8.89543 2 8 2.89543 8 4C8 5.10457 8.89543 6 10 6Z" />
      </g>

      <g className={cx(iconClassNames.outline, classes.outlinePart)}>
        <path d="M7 8.5C7 8.26842 7.05248 8.0491 7.14619 7.85328L2.14645 2.85355C1.95118 2.65829 1.95118 2.34171 2.14645 2.14645C2.34171 1.95118 2.65829 1.95118 2.85355 2.14645L17.8536 17.1464C18.0488 17.3417 18.0488 17.6583 17.8536 17.8536C17.6583 18.0488 17.3417 18.0488 17.1464 17.8536L13.4404 14.1475L13.1532 14.4239C13.0553 14.5182 12.9999 14.6482 12.9999 14.7842V16.5C12.9999 17.3284 12.3284 18 11.4999 18H8.49993C7.6715 18 6.99993 17.3284 6.99993 16.5V14.7842C6.99993 14.6482 6.94458 14.5182 6.84664 14.4239L3.14379 10.8603C2.8195 10.5482 3.04042 10 3.49051 10H9.29291L8.2929 9L7 9V8.5ZM10.2929 11H4.73109L7.54008 13.7034C7.8339 13.9862 7.99993 14.3764 7.99993 14.7842V16.5C7.99993 16.7761 8.22378 17 8.49993 17H11.4999C11.7761 17 11.9999 16.7761 11.9999 16.5V14.7842C11.9999 14.3764 12.166 13.9862 12.4598 13.7034L12.7332 13.4403L10.2929 11Z" />
        <path d="M12 4C12 5.10457 11.1046 6 10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4ZM11 4C11 3.44772 10.5523 3 10 3C9.44772 3 9 3.44772 9 4C9 4.55229 9.44772 5 10 5C10.5523 5 11 4.55229 11 4Z" />
        <path d="M10.1213 8H11.5C11.7761 8 12 8.22386 12 8.5V9H13V8.5C13 7.67157 12.3284 7 11.5 7H9.12134L10.1213 8Z" />
        <path d="M14.8817 12.7604L14.1745 12.0531L15.2688 11H13.1213L12.1213 10H16.5093C16.9594 10 17.1804 10.5482 16.8561 10.8603L14.8817 12.7604Z" />
      </g>
    </svg>
  ),
  displayName: 'NoPresenterIcon',
});
