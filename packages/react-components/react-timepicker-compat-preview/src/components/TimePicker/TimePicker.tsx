import * as React from 'react';
import { ComboBox } from '@fluentui/react';
import type { IComboBox, IComboBoxProps } from '@fluentui/react';
import type { ITimePickerProps, ITimeRange, ITimePickerStrings } from './TimePicker.types';
import { useControllableState } from '@fluentui/react-utilities';
import {
  TimeConstants,
  addMinutes,
  ceilMinuteToIncrement,
  formatTimeString,
  getDateFromTimeSelection,
} from '../../utils';

const REGEX_SHOW_SECONDS_HOUR_12 = /^((1[0-2]|0?[0-9]):([0-5][0-9]):([0-5][0-9])\s([AaPp][Mm]))$/;
const REGEX_HIDE_SECONDS_HOUR_12 = /^((1[0-2]|0?[0-9]):[0-5][0-9]\s([AaPp][Mm]))$/;
const REGEX_SHOW_SECONDS_HOUR_24 = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
const REGEX_HIDE_SECONDS_HOUR_24 = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const TIME_LOWER_BOUND = 0;
const TIME_UPPER_BOUND = 23;

const getDefaultStrings = (useHour12: boolean, showSeconds: boolean): ITimePickerStrings => {
  const hourUnits = useHour12 ? '12-hour' : '24-hour';
  const timeFormat = `hh:mm${showSeconds ? ':ss' : ''}${useHour12 ? ' AP' : ''}`;
  const invalidInputErrorMessage = `Enter a valid time in the ${hourUnits} format: ${timeFormat}`;
  const timeOutOfBoundsErrorMessage = `Please enter a time within the range of {dateStartAnchor} and {dateEndAnchor}`;

  return {
    invalidInputErrorMessage,
    timeOutOfBoundsErrorMessage,
  };
};

function isValidDate(dateObj?: Date) {
  return dateObj ? !isNaN(dateObj.getTime()) : false;
}
const dateToKey = (option?: Date) => (isValidDate(option) ? option.toISOString() : 'invalid');
const keyToDate = (key: string) => new Date(key);

/**
 * {@docCategory TimePicker}
 */
export const TimePicker: React.FunctionComponent<ITimePickerProps> = ({
  label,
  increments = 30,
  showSeconds = false,
  allowFreeform = true,
  useHour12 = false,
  timeRange,
  strings = getDefaultStrings(useHour12, showSeconds),
  defaultValue,
  value,
  dateAnchor,
  onChange,
  onFormatDate,
  onValidateUserInput,
  onValidationResult,
  ...rest
}: ITimePickerProps) => {
  const errorMessageRef = React.useRef<string | undefined>(undefined);

  const fallbackDateAnchor = React.useRef(new Date()).current;

  const [selectedTime, setSelectedTime] = useControllableState({
    state: value,
    defaultState: defaultValue,
    initialState: defaultValue,
  });

  const optionsCount = getDropdownOptionsCount(increments, timeRange);

  const internalDateAnchor = dateAnchor || value || defaultValue || fallbackDateAnchor;

  const dateStartAnchor = React.useMemo(
    () => getDateAnchor(internalDateAnchor, 'start', increments, timeRange),
    [internalDateAnchor, increments, timeRange],
  );

  const dateEndAnchor = React.useMemo(
    () => getDateAnchor(internalDateAnchor, 'end', increments, timeRange),
    [internalDateAnchor, increments, timeRange],
  );

  const getFormattedTimeString = React.useCallback(
    date => formatTimeString(date, showSeconds, useHour12),
    [showSeconds, useHour12],
  );
  const getOptionText = React.useCallback(
    (date: Date) => (onFormatDate ? onFormatDate(date) : getFormattedTimeString(date)),
    [getFormattedTimeString, onFormatDate],
  );

  const timePickerOptions: Date[] = React.useMemo(() => {
    const optionsList = Array(optionsCount);
    for (let i = 0; i < optionsCount; i++) {
      optionsList[i] = 0;
    }

    return optionsList.map((_, index) => {
      const option: Date = addMinutes(dateStartAnchor, increments * index);
      option.setSeconds(0);

      return option;
    });
  }, [dateStartAnchor, increments, optionsCount]);

  const validateUserInput = React.useCallback(
    (userInput: string): string => {
      let errorMessageToDisplay = '';
      let regex: RegExp;
      if (useHour12) {
        regex = showSeconds ? REGEX_SHOW_SECONDS_HOUR_12 : REGEX_HIDE_SECONDS_HOUR_12;
      } else {
        regex = showSeconds ? REGEX_SHOW_SECONDS_HOUR_24 : REGEX_HIDE_SECONDS_HOUR_24;
      }
      if (!regex.test(userInput)) {
        errorMessageToDisplay = strings.invalidInputErrorMessage;
      } else if (timeRange && strings.timeOutOfBoundsErrorMessage) {
        const optionDate: Date = getDateFromTimeSelection(useHour12, dateStartAnchor, userInput);
        if (optionDate < dateStartAnchor || optionDate > dateEndAnchor) {
          errorMessageToDisplay = `${strings.timeOutOfBoundsErrorMessage
            .replace('{dateStartAnchor}', dateStartAnchor.toString())
            .replace('{dateEndAnchor}', dateEndAnchor.toString())}`;
        }
      }
      return errorMessageToDisplay;
    },
    [
      dateEndAnchor,
      dateStartAnchor,
      showSeconds,
      strings.invalidInputErrorMessage,
      strings.timeOutOfBoundsErrorMessage,
      timeRange,
      useHour12,
    ],
  );

  const getErrorMessageToDisplay = React.useCallback(
    (input?: string) => {
      if (input && allowFreeform) {
        // If onFormatDate is not provided, use default validation
        if (!onFormatDate) {
          return validateUserInput(input);
        }

        // If onFormatDate is provided and there's a user-provided validation, use it
        if (onValidateUserInput) {
          return onValidateUserInput(input);
        }
      }

      return '';
    },
    [allowFreeform, onFormatDate, onValidateUserInput, validateUserInput],
  );

  const onOptionChange = React.useCallback(
    (ev: React.FormEvent<IComboBox>, option: Date) => {
      if (onValidationResult && errorMessageRef.current !== undefined) {
        onValidationResult(ev, { errorMessage: undefined });
      }

      errorMessageRef.current = undefined;
      setSelectedTime(option);
      onChange?.(ev, option);
    },
    [onChange, onValidationResult, setSelectedTime],
  );

  const onInputChange = React.useCallback(
    (ev: React.FormEvent<IComboBox>, input?: string) => {
      const errorMessageToDisplay = getErrorMessageToDisplay(input);

      if (onValidationResult && errorMessageRef.current !== errorMessageToDisplay) {
        // only call onValidationResult if stored errorMessage state value is different from latest error message
        onValidationResult(ev, { errorMessage: errorMessageToDisplay });
      }

      // Set default values for changed time and combobox text
      let changedTime = new Date('invalid');
      let nextSelectedTime: Date | undefined = changedTime;

      const isInputEmptyString = input !== undefined && !input.length;

      // Check for valid input
      if (!errorMessageToDisplay && !isInputEmptyString) {
        changedTime = getDateFromTimeSelection(useHour12, dateStartAnchor, input ?? '');
        nextSelectedTime = changedTime;
      } else if (isInputEmptyString) {
        nextSelectedTime = undefined;
      }

      errorMessageRef.current = errorMessageToDisplay;
      setSelectedTime(nextSelectedTime);
      onChange?.(ev, changedTime);
    },
    [dateStartAnchor, getErrorMessageToDisplay, onChange, onValidationResult, setSelectedTime, useHour12],
  );

  const onComboboxChange: IComboBoxProps['onChange'] = React.useCallback(
    (ev: React.FormEvent<IComboBox>, option, _index?: number, input?: string): void => {
      if (option) {
        onOptionChange(ev, keyToDate(option.key as string));
      } else {
        onInputChange(ev, input);
      }
    },
    [onOptionChange, onInputChange],
  );

  const evaluatePressedKey = (event: React.KeyboardEvent<IComboBox>) => {
    const key = event.key.toUpperCase();

    if (
      !onFormatDate &&
      // Only permit input of digits, space, colon, A/P/M characters
      !(
        (!isNaN(Number(key)) && key.length === 1) || // Check if it's a digit
        key === ' ' ||
        key === ':' ||
        key === 'A' ||
        key === 'P' ||
        key === 'M'
      )
    ) {
      event.preventDefault();
    }
  };

  const comboBoxText = React.useMemo(() => {
    if (isValidDate(selectedTime)) {
      const comboboxOption = timePickerOptions.find(option => dateToKey(option) === dateToKey(selectedTime));
      return comboboxOption ? getOptionText(comboboxOption) : getFormattedTimeString(selectedTime);
    }
    return '';
  }, [getFormattedTimeString, getOptionText, selectedTime, timePickerOptions]);

  return (
    <ComboBox
      {...rest}
      allowFreeform={allowFreeform}
      selectedKey={dateToKey(selectedTime)}
      label={label}
      errorMessage={errorMessageRef.current}
      options={timePickerOptions.map(date => ({ key: dateToKey(date), text: getOptionText(date) }))}
      onChange={onComboboxChange}
      text={comboBoxText}
      //eslint-disable-next-line
      onKeyPress={evaluatePressedKey}
      useComboBoxAsMenuWidth
    />
  );
};
TimePicker.displayName = 'TimePicker';

const getDateAnchor = (
  internalDateAnchor: Date,
  startEnd: 'start' | 'end',
  increments: number,
  timeRange?: ITimeRange,
) => {
  const clampedDateAnchor = new Date(internalDateAnchor.getTime());
  if (timeRange) {
    const clampedTimeRange = clampTimeRange(timeRange);
    const timeRangeHours = startEnd === 'start' ? clampedTimeRange.start : clampedTimeRange.end;
    if (clampedDateAnchor.getHours() !== timeRangeHours) {
      clampedDateAnchor.setHours(timeRangeHours);
    }
  } else if (startEnd === 'end') {
    clampedDateAnchor.setDate(clampedDateAnchor.getDate() + 1);
  }
  clampedDateAnchor.setMinutes(0);
  clampedDateAnchor.setSeconds(0);
  clampedDateAnchor.setMilliseconds(0);

  return ceilMinuteToIncrement(clampedDateAnchor, increments);
};

const clampTimeRange = (timeRange: ITimeRange): ITimeRange => {
  return {
    start: Math.min(Math.max(timeRange.start, TIME_LOWER_BOUND), TIME_UPPER_BOUND),
    end: Math.min(Math.max(timeRange.end, TIME_LOWER_BOUND), TIME_UPPER_BOUND),
  };
};

const getHoursInRange = (timeRange: ITimeRange | undefined) => {
  let hoursInRange = TimeConstants.HoursInOneDay;
  if (timeRange) {
    const clampedTimeRange = clampTimeRange(timeRange);
    if (clampedTimeRange.start > clampedTimeRange.end) {
      hoursInRange = TimeConstants.HoursInOneDay - timeRange.start - timeRange.end;
    } else if (timeRange.end > timeRange.start) {
      hoursInRange = timeRange.end - timeRange.start;
    }
  }

  return hoursInRange;
};

const getDropdownOptionsCount = (increments: number, timeRange: ITimeRange | undefined) => {
  const hoursInRange = getHoursInRange(timeRange);
  return Math.floor((TimeConstants.MinutesInOneHour * hoursInRange) / increments);
};
