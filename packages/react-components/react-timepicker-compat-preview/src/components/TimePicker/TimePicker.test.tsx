import * as React from 'react';
import { isConformant } from '../../testing/isConformant';
import { TimePicker } from './TimePicker';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimePickerProps } from './TimePicker.types';

const dateAnchor = new Date('November 25, 2021 01:00:00');

describe('TimePicker', () => {
  isConformant({
    Component: TimePicker,
    displayName: 'TimePicker',
    primarySlot: 'input',
    testOptions: {
      'has-static-classnames': [
        {
          props: {
            open: true,
            // Portal messes with the classNames test, so rendering the listbox inline here
            inlinePopup: true,
          },
        },
      ],
    },
  });

  it('generates the formatted option', () => {
    const { getByRole, getAllByRole } = render(<TimePicker dateAnchor={dateAnchor} startHour={8} endHour={9} />);

    const input = getByRole('combobox');
    userEvent.click(input);
    const options = getAllByRole('option');
    expect(options.length).toBe(2);
    expect(options[0].textContent).toBe('08:00');
    expect(options[1].textContent).toBe('08:30');
  });

  it('generates the formatted option using formatDateToTimeString', () => {
    const { getByRole, getAllByRole } = render(
      <TimePicker dateAnchor={dateAnchor} formatDateToTimeString={() => 'custom'} />,
    );

    const input = getByRole('combobox');
    userEvent.click(input);
    expect(getAllByRole('option')[0].textContent).toBe('custom');
  });

  it('shows controlled time correctly', () => {
    const TestExample = () => {
      const [selectedTime, setSelectedTime] = React.useState<Date | undefined>(dateAnchor);
      const onTimeSelect: TimePickerProps['onTimeSelect'] = (_e, data) => setSelectedTime(data.selectedTime);
      return (
        <TimePicker dateAnchor={dateAnchor} increment={60} selectedTime={selectedTime} onTimeSelect={onTimeSelect} />
      );
    };

    const { getByRole, getAllByRole } = render(<TestExample />);

    const input = getByRole('combobox');
    userEvent.click(input);
    expect(getAllByRole('option')[1].getAttribute('aria-selected')).toBe('true'); // '1:00' is selected

    userEvent.click(getAllByRole('option')[10]);
    expect(getByRole('combobox').getAttribute('value')).toBe('10:00');
  });

  it('when freeform, trigger onTimeSelect only when value change', () => {
    const handleTimeSelect = jest.fn();
    const { getByRole, getAllByRole } = render(
      <TimePicker freeform dateAnchor={dateAnchor} onTimeSelect={handleTimeSelect} startHour={10} />,
    );

    const input = getByRole('combobox');
    userEvent.click(input);
    userEvent.click(getAllByRole('option')[1]);
    expect(handleTimeSelect).toHaveBeenCalledTimes(1);
    expect(handleTimeSelect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ selectedTimeText: '10:30' }),
    );
    handleTimeSelect.mockClear();

    userEvent.tab();
    expect(handleTimeSelect).toHaveBeenCalledTimes(0);

    userEvent.type(input, '111');
    userEvent.tab();
    expect(handleTimeSelect).toHaveBeenCalledTimes(1);
    expect(handleTimeSelect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ selectedTimeText: '10:30111', error: 'invalid-input' }),
    );
  });
});
