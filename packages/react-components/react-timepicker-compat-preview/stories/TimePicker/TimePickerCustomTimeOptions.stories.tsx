import * as React from 'react';
import { Option, OptionGroup, useId, makeStyles } from '@fluentui/react-components';
import { TimePicker } from '@fluentui/react-timepicker-compat-preview';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    justifyItems: 'start',
    rowGap: '2px',
    maxWidth: '400px',
  },
  label: { fontStyle: 'italic' },
});

export const CustomTimeOptions = () => {
  const id = useId('timepicker-custom-time-options-');
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <label id={id}>Coffee time</label>
      <TimePicker aria-labelledby={id} startHour={9} endHour={15} hour12>
        {({ options }) => {
          const morningOptions = options.filter(option => option.text.endsWith('am'));
          const afternoonOptions = options.filter(option => option.text.endsWith('pm'));
          return (
            <>
              <OptionGroup label={{ children: 'morning', className: styles.label }}>
                {morningOptions.map(date => (
                  <Option key={date.key} value={date.key} disabled={date.text === '11:00 am'}>
                    {date.text}
                  </Option>
                ))}
              </OptionGroup>
              <OptionGroup label={{ children: 'afternoon', className: styles.label }}>
                {afternoonOptions.map(date => (
                  <Option key={date.key} value={date.key}>
                    {date.text}
                  </Option>
                ))}
              </OptionGroup>
            </>
          );
        }}
      </TimePicker>
    </div>
  );
};

CustomTimeOptions.parameters = {
  docs: {
    description: {
      story: 'Time options in dropdown can be customized by passing a function as the children of TimePicker.',
    },
  },
};
