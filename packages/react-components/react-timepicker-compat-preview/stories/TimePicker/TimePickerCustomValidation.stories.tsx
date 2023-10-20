import * as React from 'react';
import { Field, FieldProps, makeStyles } from '@fluentui/react-components';
import { TimePicker, TimePickerErrorType, TimePickerProps } from '@fluentui/react-timepicker-compat-preview';

const useStyles = makeStyles({
  root: {
    maxWidth: '400px',
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

export const CustomValidation = () => {
  const styles = useStyles();

  const [anchor] = React.useState(new Date('November 25, 2023'));

  const [errorType, setErrorType] = React.useState<TimePickerErrorType>();
  const handleTimeSelect: TimePickerProps['onTimeSelect'] = (_ev, { error }) => {
    setErrorType(error);
  };

  const validateFreeFormTime: TimePickerProps['validateFreeFormTime'] = (time: string | undefined) => {
    if (!time) {
      return { error: 'required-input', date: null };
    }
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      return { error: 'invalid-input', date: null };
    }

    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), hours, minutes);

    if (date.getHours() < 10 || date.getHours() >= 20) {
      return { date, error: 'out-of-bounds' };
    }

    return { date };
  };

  const validateOption: TimePickerProps['validateOption'] = ({ date }) => {
    if (date && (date.getHours() < 10 || date.getHours() >= 20)) {
      return 'out-of-bounds';
    }
    return undefined;
  };

  return (
    <Field
      className={styles.root}
      required
      label={
        `Select a time outside of 10:00 to 19:59,` +
        ` type an invalid time, or leave the input empty and close the TimePicker.`
      }
      validationMessage={getErrorMessage(errorType)}
    >
      <TimePicker
        freeform
        dateAnchor={anchor}
        onTimeSelect={handleTimeSelect}
        validateFreeFormTime={validateFreeFormTime}
        validateOption={validateOption}
      />
    </Field>
  );
};

CustomValidation.parameters = {
  docs: {
    description: {
      story:
        'Use `validateOption` to validate the time selected from the dropdown. Use `validateFreeFormTime` to add custom validation for input value submitted in a freeform TimePicker, and perform custom parsing from the input value to date object.',
    },
  },
};
