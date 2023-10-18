import * as React from 'react';
import { useId, makeStyles } from '@fluentui/react-components';
import { TimePicker, TimePickerProps, formatDateToTimeString } from '@fluentui/react-timepicker-compat-preview';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    justifyItems: 'start',
    rowGap: '20px',
    maxWidth: '400px',
  },
  field: {
    display: 'grid',
    justifyItems: 'start',
    rowGap: '2px',
  },
});

const DefaultSelection = () => {
  const timepickerId = useId('timepicker-default-selection');
  const styles = useStyles();

  const [anchor] = React.useState(new Date('November 25, 2023'));
  const [defaultSelectedTime] = React.useState(new Date('November 25, 2023 12:30:00'));
  return (
    <div className={styles.field}>
      <label htmlFor={timepickerId}>Select a time (default Selection)</label>
      <TimePicker
        id={timepickerId}
        startHour={8}
        endHour={20}
        dateAnchor={anchor}
        defaultSelectedTime={defaultSelectedTime}
        defaultValue={formatDateToTimeString(defaultSelectedTime)}
      />
    </div>
  );
};

const ControlledSelection = () => {
  const timepickerId = useId('timepicker-controlled-selection');
  const styles = useStyles();

  const [anchor] = React.useState(new Date('November 25, 2023'));

  const [selectedTime, setSelectedTime] = React.useState<Date | undefined>(new Date('November 25, 2023 12:30:00'));
  const [value, setValue] = React.useState<string>(selectedTime ? formatDateToTimeString(selectedTime) : '');

  const onTimeSelect: TimePickerProps['onTimeSelect'] = (_ev, data) => {
    setSelectedTime(data.selectedTime);
    setValue(data.selectedTimeText ?? '');
  };
  const onInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value);
  };

  return (
    <div className={styles.field}>
      <label htmlFor={timepickerId}>Select a time (controlled Selection)</label>
      <TimePicker
        id={timepickerId}
        startHour={8}
        endHour={20}
        dateAnchor={anchor}
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
        value={value}
        onInput={onInput}
      />
    </div>
  );
};

export const Controlled = () => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <DefaultSelection />
      <ControlledSelection />
    </div>
  );
};
