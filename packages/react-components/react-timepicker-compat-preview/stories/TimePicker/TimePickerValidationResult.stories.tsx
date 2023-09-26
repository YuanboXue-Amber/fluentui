import * as React from 'react';
import { TimePicker } from '@fluentui/react-timepicker-compat-preview';
import { Label, Button } from '@fluentui/react-components';

const timeRange = {
  start: 8,
  end: 17,
};

export const ValidationResult = () => {
  const dateAnchor = new Date('February 27, 2023 08:00:00');
  const [time, setTime] = React.useState<Date>(new Date('January 1, 2023 08:00:00'));
  const [disableButton, setDisableButton] = React.useState<boolean>(false);

  const onControlledExampleChange = React.useCallback((_, newTime: Date) => {
    setTime(newTime);
  }, []);

  const onValidationResult = React.useCallback((_, timePickerValidationResultData: TimePickerValidationResultData) => {
    if (timePickerValidationResultData.errorMessage !== undefined) {
      console.log('Validation error message received: ', timePickerValidationResultData.errorMessage);
      setDisableButton(timePickerValidationResultData.errorMessage.length > 0);
    }
  }, []);

  return (
    <>
      <TimePicker
        allowFreeform
        useHour12
        increments={15}
        autoComplete="on"
        label="Controlled TimePicker with onValidationResult handling"
        dateAnchor={dateAnchor}
        value={time}
        onChange={onControlledExampleChange}
        onValidationResult={onValidationResult}
        timeRange={timeRange}
      />
      <span>{`⚓ Date anchor: ${dateAnchor.toString()}`}</span>
      <span>{`⌚ Selected time: ${time ? time.toString() : '<no time selected>'}`}</span>

      <Label>
        To trigger the TimePicker validation error and disable the button, enter a time outside the range of 8AM and 5PM
        or an invalid-formatted date.
      </Label>
      <Button appearance="primary" disabled={disableButton}>
        Sample submit button
      </Button>
    </>
  );
};
ValidationResult.storyName = 'ValidationResult';
// ValidationResult.parameters = {
//   docs: {
//     description: {
//       story:  '',
//     },
//   },
// };
