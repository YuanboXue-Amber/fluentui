import * as React from 'react';
import { createSvgIcon } from '../utils/createSvgIcon';

export const LiveIcon = createSvgIcon({
  svg: ({ classes }) => (
    <svg role="presentation" focusable="false" viewBox="0 0 20 20" className={classes.svg}>
      <path d="M4.35281 4.33358C4.53936 4.14767 4.83968 4.15776 5.02591 4.344C5.22983 4.54791 5.21706 4.88086 5.01461 5.08624C3.76882 6.35005 3 8.08528 3 10.0001C3 11.9902 3.83047 13.7863 5.16377 15.0608C5.37638 15.2641 5.39483 15.6053 5.18685 15.8132C5.00478 15.9953 4.71256 16.0093 4.52487 15.833C2.97073 14.3737 2 12.3002 2 10.0001C2 7.78604 2.89942 5.78206 4.35281 4.33358Z" />
      <path d="M14.9854 5.08624C14.7829 4.88086 14.7702 4.54791 14.9741 4.344C15.1603 4.15776 15.4606 4.14767 15.6472 4.33358C17.1006 5.78206 18 7.78604 18 10.0001C18 12.3002 17.0293 14.3737 15.4751 15.833C15.2874 16.0093 14.9952 15.9953 14.8132 15.8132C14.6052 15.6053 14.6236 15.2641 14.8362 15.0608C16.1695 13.7863 17 11.9902 17 10.0001C17 8.08528 16.2312 6.35005 14.9854 5.08624Z" />
      <path d="M6.13159 6.0903C6.31407 5.90973 6.60608 5.92403 6.78761 6.10556C6.99573 6.31368 6.97537 6.6551 6.7704 6.86631C5.98409 7.67655 5.5 8.78172 5.5 9.99995C5.5 11.2905 6.04324 12.4541 6.91351 13.2747C7.13387 13.4824 7.16356 13.8364 6.9494 14.0505C6.77419 14.2258 6.49437 14.2453 6.31064 14.0791C5.19861 13.0727 4.5 11.6179 4.5 9.99995C4.5 8.47068 5.12414 7.08719 6.13159 6.0903Z" />
      <path d="M13.2296 6.86631C13.0246 6.6551 13.0043 6.31368 13.2124 6.10556C13.3939 5.92403 13.6859 5.90973 13.8684 6.0903C14.8759 7.08718 15.5 8.47068 15.5 9.99995C15.5 11.6179 14.8014 13.0727 13.6894 14.0791C13.5056 14.2453 13.2258 14.2258 13.0506 14.0505C12.8364 13.8364 12.8661 13.4824 13.0865 13.2747C13.9568 12.4541 14.5 11.2905 14.5 9.99995C14.5 8.78172 14.0159 7.67655 13.2296 6.86631Z" />
      <path d="M10 8.75C9.30964 8.75 8.75 9.30964 8.75 10C8.75 10.6904 9.30964 11.25 10 11.25C10.6904 11.25 11.25 10.6904 11.25 10C11.25 9.30964 10.6904 8.75 10 8.75Z" />
    </svg>
  ),
  displayName: 'LiveIcon',
});
