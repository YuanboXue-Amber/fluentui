import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isConformant } from '../../testing/isConformant';
import { TimePicker } from './TimePicker';
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

  describe('freeform', () => {
    const handleTimeSelect = jest.fn();

    const ControlledFreeFormExample = () => {
      const [selectedTime, setSelectedTime] = React.useState<Date | null>(dateAnchor);
      const onTimeSelect: TimePickerProps['onTimeSelect'] = (e, data) => {
        handleTimeSelect(e, data);
        setSelectedTime(data.selectedTime);
      };
      return (
        <TimePicker
          freeform
          dateAnchor={dateAnchor}
          startHour={10}
          selectedTime={selectedTime}
          onTimeSelect={onTimeSelect}
        />
      );
    };

    const UnControlledFreeFormExample = () => (
      <TimePicker freeform dateAnchor={dateAnchor} onTimeSelect={handleTimeSelect} startHour={10} />
    );

    beforeEach(() => {
      handleTimeSelect.mockClear();
    });

    it.each`
      name              | Component
      ${'uncontrolled'} | ${UnControlledFreeFormExample}
      ${'controlled'}   | ${ControlledFreeFormExample}
    `(
      '$name - when input value is not prefix of any option, submit the value as selectedTime on Enter',
      ({ Component }) => {
        const { getByRole } = render(<Component />);
        const input = getByRole('combobox');
        userEvent.type(input, '111{enter}');
        expect(handleTimeSelect).toHaveBeenCalledTimes(1);
        expect(handleTimeSelect).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ selectedTime: null, selectedTimeText: '111', error: 'invalid-input' }),
        );
      },
    );

    it.each`
      name              | Component
      ${'uncontrolled'} | ${UnControlledFreeFormExample}
      ${'controlled'}   | ${ControlledFreeFormExample}
    `('$name - when input value is prefix of an option, select the option from dropdown on Enter', ({ Component }) => {
      const { getByRole } = render(<Component />);
      const input = getByRole('combobox');
      userEvent.type(input, '11:{enter}');
      expect(handleTimeSelect).toHaveBeenCalledTimes(1);
      expect(handleTimeSelect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ selectedTimeText: '11:00', error: undefined }),
      );
    });

    it.each`
      name              | Component
      ${'uncontrolled'} | ${UnControlledFreeFormExample}
      ${'controlled'}   | ${ControlledFreeFormExample}
    `('$name - trigger onTimeSelect only when value change', ({ Component }) => {
      const { getByRole, getAllByRole } = render(<Component />);

      const input = getByRole('combobox');

      // Call onTimeSelect when select an option
      userEvent.click(input);
      userEvent.click(getAllByRole('option')[1]);
      expect(handleTimeSelect).toHaveBeenCalledTimes(1);
      expect(handleTimeSelect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ selectedTimeText: '10:30' }),
      );
      handleTimeSelect.mockClear();

      // Do not call onTimeSelect on Enter when the value remains the same
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(handleTimeSelect).toHaveBeenCalledTimes(0);

      // Call onTimeSelect on Enter when the value changes
      userEvent.type(input, '111{enter}');
      expect(handleTimeSelect).toHaveBeenCalledTimes(1);
      expect(handleTimeSelect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ selectedTimeText: '10:30111', error: 'invalid-input' }),
      );
    });

    it.each`
      name              | Component
      ${'uncontrolled'} | ${UnControlledFreeFormExample}
      ${'controlled'}   | ${ControlledFreeFormExample}
    `('$name - trigger onTimeSelect on blur when value change', ({ Component }) => {
      const { getByRole } = render(<Component />);

      const input = getByRole('combobox');
      const expandIcon = getByRole('button');

      // Do not call onTimeSelect when clicking dropdown icon
      userEvent.type(input, '111');
      userEvent.click(expandIcon);
      expect(handleTimeSelect).toHaveBeenCalledTimes(0);

      // Call onTimeSelect on focus lose
      userEvent.tab();
      expect(handleTimeSelect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ selectedTimeText: '111' }),
      );
    });
  });
});
