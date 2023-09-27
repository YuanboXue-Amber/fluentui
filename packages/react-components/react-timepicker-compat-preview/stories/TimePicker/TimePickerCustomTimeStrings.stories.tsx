import * as React from 'react';
import { TimePicker } from '@fluentui/react-timepicker-compat-preview';

export const CustomTimeStrings = () => {
  const [customTimeString, setCustomTimeString] = React.useState<string>('');
  const dateAnchor = new Date('February 27, 2023 08:00:00');
  const onFormatDate = React.useCallback((date: Date) => `Custom prefix + ${date.toLocaleTimeString()}`, []);
  const onValidateUserInput = React.useCallback((userInput: string) => {
    if (!userInput.includes('Custom prefix +')) {
      return 'Your input is missing "Custom prefix +"';
    }
    return '';
  }, []);

  const onChange = React.useCallback((_, time: Date) => {
    console.log('Selected time: ', time);
    setCustomTimeString(time.toString());
  }, []);

  return (
    <>
      <TimePicker
        placeholder="Custom time strings example placeholder"
        onFormatDate={onFormatDate}
        onValidateUserInput={onValidateUserInput}
        onChange={onChange}
        useHour12
        allowFreeform={false}
        dateAnchor={dateAnchor}
        autoComplete="on"
        label="TimePicker with custom time strings"
      />
      <span>{`⚓ Date anchor: ${dateAnchor.toString()}`}</span>
      <span>{`⌚ Selected time: ${customTimeString ? customTimeString : '<no time selected>'}`}</span>
    </>
  );
};

CustomTimeStrings.storyName = 'CustomTimeStrings';
// CustomTimeStrings.parameters = {
//   docs: {
//     description: {
//       story:  '',
//     },
//   },
// };
