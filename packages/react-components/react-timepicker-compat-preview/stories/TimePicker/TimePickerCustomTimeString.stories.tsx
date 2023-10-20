import * as React from 'react';
import { Field, makeStyles } from '@fluentui/react-components';
import { TimePicker } from '@fluentui/react-timepicker-compat-preview';

const useStyles = makeStyles({
  root: {
    maxWidth: '300px',
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
  const styles = useStyles();

  const [anchor] = React.useState(new Date(2023, 1, 1));
  return (
    <Field label="Coffee time" className={styles.root}>
      <TimePicker startHour={9} endHour={15} dateAnchor={anchor} formatDateToTimeString={formatDateToTimeString} />
    </Field>
  );
};

CustomTimeString.parameters = {
  docs: {
    description: {
      story: 'The time display format can be customized using `formatDateToTimeString`.',
    },
  },
};
