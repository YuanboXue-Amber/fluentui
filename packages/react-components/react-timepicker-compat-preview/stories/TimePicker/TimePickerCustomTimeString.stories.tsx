import * as React from 'react';
import { TimePicker, TimePickerProps } from '@fluentui/react-timepicker-compat-preview';

export const CustomTimeString = () => {
  const anchor = React.useRef(new Date(2021, 1, 1, 12, 0, 0, 0)).current;

  const onTimeSelect: TimePickerProps['onTimeSelect'] = (_ev, data) => {
    console.log('Amber onTimeSelect', data);
  };

  const formatDate = React.useCallback((date: Date) => `Custom prefix + ${date.toLocaleTimeString()}`, []);

  return (
    <TimePicker
      freeform
      startHour={8}
      endHour={20}
      dateAnchor={anchor}
      onTimeSelect={onTimeSelect}
      formatDateToTimeString={formatDate}
    />
  );
};
