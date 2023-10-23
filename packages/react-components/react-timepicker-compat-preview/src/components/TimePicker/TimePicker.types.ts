import * as React from 'react';
import type { ComboboxSlots, ComboboxState, ComboboxProps, SelectionEvents } from '@fluentui/react-combobox';

export type Hour =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

/**
 * Data structure for rendering options in the TimePicker.
 */
export type TimePickerOption = {
  /**
   * The Date object associated with the option.
   */
  date: Date | null;

  /**
   * A unique identifier for the option.
   */
  key: string;

  /**
   * The display text for the option within the Combobox dropdown.
   */
  text: string;
};

/**
 * Error types returned by the `onValidationResult` callback.
 */
export type TimePickerErrorType = 'invalid-input' | 'out-of-bounds' | 'required-input';

export type TimeStringValidationResult = {
  date: Date | null;
  error?: TimePickerErrorType;
};

export type TimePickerSlots = ComboboxSlots;

export type TimeSelectionEvents = SelectionEvents | React.FocusEvent<HTMLElement>;
export type TimeSelectionData = {
  /**
   * The Date object associated with the selected option. For freeform TimePicker it can also be the Date object parsed from the user input.
   */
  selectedTime: Date | null;
  /**
   * The display text for the selected option. For freeform TimePicker it can also be the value in user input.
   */
  selectedTimeText: string | undefined;
  /**
   * The error type for the selected option.
   */
  error: TimePickerErrorType | undefined;
};

export type TimeFormatOptions = {
  /**
   * A string value indicating whether the 12-hour format ("h11", "h12") or the 24-hour format ("h23", "h24") should be used.
   * - 'h11' and 'h23' start with hour 0 and go up to 11 and 23 respectively.
   * - 'h12' and 'h24' start with hour 1 and go up to 12 and 24 respectively.
   * @default 'h23'
   */
  hourCycle?: 'h11' | 'h12' | 'h23' | 'h24' | undefined;

  /**
   * If true, show seconds in the dropdown options and consider seconds for default validation purposes.
   */
  showSeconds?: boolean;
};

export type TimePickerChildrenProps = { options: TimePickerOption[] };

/**
 * TimePicker Props
 */
export type TimePickerProps = Omit<
  ComboboxProps,
  // Omit children as TimePicker supports children as render function
  | 'children'
  // Omit selection props as TimePicker has `selectedTime` props
  | 'defaultSelectedOptions'
  | 'multiselect'
  | 'onOptionSelect'
  | 'selectedOptions'
> &
  TimeFormatOptions & {
    /**
     * TimePicker has default children. It can be customized as either:
     * 1. A single element
     * 2. A render function that will receive properties and must return a valid element or null
     * 3. null or undefined
     */
    children?:
      | React.ReactElement
      | React.ReactElement[]
      | ((props: TimePickerChildrenProps) => React.ReactElement[] | React.ReactElement | null)
      | null;

    /**
     * Start hour (inclusive) for the time range, 0-24.
     */
    startHour?: Hour;

    /**
     * End hour (exclusive) for the time range, 0-24.
     */
    endHour?: Hour;

    /**
     * Time increment, in minutes, of the options in the dropdown.
     */
    increment?: number;

    /**
     * The date in which all dropdown options are based off of.
     */
    dateAnchor?: Date;

    /**
     * Currently selected time in the TimePicker.
     */
    selectedTime?: Date | null;

    /**
     * Default selected time in the TimePicker, for uncontrolled scenarios.
     */
    defaultSelectedTime?: Date;

    /**
     * Callback for when a time selection is made.
     */
    onTimeSelect?: (event: TimeSelectionEvents, data: TimeSelectionData) => void;

    /**
     * Custom the date strings displayed in dropdown options.
     */
    formatDateToTimeString?: (date: Date) => string;

    /**
     * Custom validation for the input time string from user in freeform TimePicker.
     */
    validateFreeFormTime?: (time: string | undefined) => TimeStringValidationResult;

    /**
     * Custom validation for the time selected from dropdown.
     */
    validateOption?: (option: TimePickerOption) => TimePickerErrorType | undefined;
  };

/**
 * State used in rendering TimePicker
 */
export type TimePickerState = ComboboxState &
  Required<Pick<TimePickerProps, 'freeform' | 'validateFreeFormTime'>> & {
    /**
     * Submitted text from the input field. It is used to determine if the input value has changed when user submit a new value on Enter or blur from input.
     */
    submittedText: string | undefined;
  };
