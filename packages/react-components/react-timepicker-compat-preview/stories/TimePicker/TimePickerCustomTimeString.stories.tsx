import * as React from 'react';
import { useId, makeStyles } from '@fluentui/react-components';
import { TimePicker } from '@fluentui/react-timepicker-compat-preview';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    justifyItems: 'start',
    rowGap: '2px',
    maxWidth: '400px',
  },
});

const formatDateToTimeString = (date: Date) => {
  const localeTimeString = date.toLocaleTimeString();
  if (date.getHours() < 12) {
    return `Morning: ${localeTimeString}`;
  }
  return `Afternoon: ${localeTimeString}`;
};

export const CustomTimeString = () => {
  const id = useId('timepicker-custom-time-string-');
  const styles = useStyles();

  const [anchor] = React.useState(new Date(2023, 1, 1));
  return (
    <div className={styles.root}>
      <label id={id}>Coffee time</label>
      <TimePicker
        aria-labelledby={id}
        startHour={9}
        endHour={15}
        dateAnchor={anchor}
        formatDateToTimeString={formatDateToTimeString}
      />
    </div>
  );
};

CustomTimeString.parameters = {
  docs: {
    description: {
      story: 'The time display format can be customized using `formatDateToTimeString`.',
    },
  },
};
