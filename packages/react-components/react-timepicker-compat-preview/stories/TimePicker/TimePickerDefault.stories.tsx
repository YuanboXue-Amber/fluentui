import * as React from 'react';
import { useId, makeStyles } from '@fluentui/react-components';
import { TimePicker, TimePickerProps } from '@fluentui/react-timepicker-compat-preview';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    justifyItems: 'start',
    rowGap: '2px',
    maxWidth: '400px',
  },
});

export const Default = (props: Partial<TimePickerProps>) => {
  const id = useId('timepicker-');
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <label id={id}>Coffee time</label>
      <TimePicker aria-labelledby={id} {...props} />
    </div>
  );
};
