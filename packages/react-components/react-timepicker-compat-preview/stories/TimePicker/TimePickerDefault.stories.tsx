import * as React from 'react';
import { TimePicker, TimePickerProps } from '@fluentui/react-timepicker-compat-preview';

export const Default = (props: Partial<TimePickerProps>) => {
  const onTimeSelect: TimePickerProps['onTimeSelect'] = (_ev, data) => {
    console.log('Amber onTimeSelect', data);
  };
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleChange = (e: Event) => {
      console.log('[Simple input]: handleChange', e, document.activeElement);
    };

    const element = inputRef.current;
    if (element) {
      element.addEventListener('change', handleChange);
    }

    return () => {
      if (element) {
        element.removeEventListener('change', handleChange);
      }
    };
  }, []);

  return (
    <>
      <TimePicker hour12 freeform startHour={8} endHour={20} onTimeSelect={onTimeSelect} />
      <input type="text" ref={inputRef} />
    </>
  );
};
