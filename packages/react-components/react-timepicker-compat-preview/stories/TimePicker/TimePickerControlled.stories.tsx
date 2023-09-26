import * as React from 'react';
import { TimePicker } from '@fluentui/react-timepicker-compat-preview';

export const Controlled = () => {
  const dateAnchor = new Date('February 27, 2023 08:00:00');
  const [time, setTime] = React.useState<Date>(new Date('February 27, 2023 10:00:00'));

  const onControlledExampleChange = React.useCallback((_, newTime: Date) => {
    setTime(newTime);
  }, []);

  return (
    <>
      <TimePicker
        showSeconds
        allowFreeform
        increments={15}
        autoComplete="on"
        label="Controlled TimePicker with non default options"
        dateAnchor={dateAnchor}
        value={time}
        onChange={onControlledExampleChange}
      />
      <span>{`⚓ Date anchor: ${dateAnchor.toString()}`}</span>
      <span>{`⌚ Selected time: ${time ? time.toString() : '<no time selected>'}`}</span>
    </>
  );
};

Controlled.storyName = 'Controlled';
// Controlled.parameters = {
//   docs: {
//     description: {
//       story:  '',
//     },
//   },
// };
