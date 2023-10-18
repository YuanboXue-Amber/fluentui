import * as React from 'react';
import { TimePicker, TimePickerProps, formatDateToTimeString } from '@fluentui/react-timepicker-compat-preview';

export const Controlled = () => {
  const anchor = React.useRef(new Date(2021, 1, 1, 12, 0, 0, 0)).current;
  const [selectedTime, setSelectedTime] = React.useState<Date | undefined>(anchor);
  const [value, setValue] = React.useState<string>(formatDateToTimeString(anchor, { hour12: true }));

  const onTimeSelect: TimePickerProps['onTimeSelect'] = (_ev, data) => {
    setSelectedTime(data.selectedTime);
    setValue(data.selectedTimeText ?? '');
    console.log('Amber onTimeSelect', data);
  };
  const onInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value);
  };

  return (
    <TimePicker
      freeform
      startHour={8}
      endHour={20}
      hour12
      dateAnchor={anchor}
      selectedTime={selectedTime}
      onTimeSelect={onTimeSelect}
      value={value}
      onInput={onInput}
    />
  );
};
