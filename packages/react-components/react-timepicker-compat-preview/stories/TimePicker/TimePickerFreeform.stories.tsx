import * as React from 'react';
import { Field, FieldProps, makeStyles } from '@fluentui/react-components';
import { TimePicker, TimePickerErrorType, TimePickerProps } from '@fluentui/react-timepicker-compat-preview';

const useStyles = makeStyles({
  root: {
    maxWidth: '300px',
  },
});

const getErrorMessage = (error?: TimePickerErrorType): FieldProps['validationMessage'] => {
  switch (error) {
    case 'invalid-input':
      return 'Invalid time format. Please use the 24-hour format HH:MM.';
    case 'out-of-bounds':
      return 'Time out of the 10:00 to 19:59 range.';
    case 'required-input':
      return 'Time is required.';
    default:
      return '';
  }
};

export const FreeformWithErrorHandling = () => {
  const styles = useStyles();

  const [errorType, setErrorType] = React.useState<TimePickerErrorType>();
  const handleTimeSelect: TimePickerProps['onTimeSelect'] = (_ev, { error }) => {
    setErrorType(error);
  };

  return (
    <Field
      className={styles.root}
      required
      label={
        `Type a time outside of 10:00 to 19:59,` +
        ` type an invalid time, or leave the input empty and close the TimePicker.`
      }
      validationMessage={getErrorMessage(errorType)}
    >
      <TimePicker freeform startHour={10} endHour={20} onTimeSelect={handleTimeSelect} />
    </Field>
  );
};

FreeformWithErrorHandling.parameters = {
  docs: {
    description: {
      story:
        'TimePicker supports the freeform prop, which allows freeform text input. Use Field to display the error message based on the error type provided by `onTimeSelect`.',
    },
  },
};
