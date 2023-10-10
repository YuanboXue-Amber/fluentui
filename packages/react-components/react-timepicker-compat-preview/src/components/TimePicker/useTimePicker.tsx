import * as React from 'react';
import { useControllableState } from '@fluentui/react-utilities';
import type { Hour, TimePickerOption, TimePickerProps, TimePickerState, TimeSelectionData } from './TimePicker.types';
import { ComboboxProps, useCombobox_unstable, Option } from '@fluentui/react-combobox';
import {
  dateToKey,
  keyToDate,
  formatTimeString,
  getDateStartAnchor,
  getDateEndAnchor,
  getTimesBetween,
  getDateFromTimeString,
} from './timeMath';

// TODO before stable, replace useCallback to useEventCallback if needed

/**
 * Create the state required to render TimePicker.
 *
 * The returned state can be modified with hooks such as useTimePickerStyles_unstable,
 * before being passed to renderTimePicker_unstable.
 *
 * @param props - props from this instance of TimePicker
 * @param ref - reference to root HTMLElement of TimePicker
 */
export const useTimePicker_unstable = (props: TimePickerProps, ref: React.Ref<HTMLInputElement>): TimePickerState => {
  const {
    dateAnchor: dateAnchorInProps,
    defaultSelectedTime: defaultSelectedTimeInProps,
    endHour = 24,
    hour12 = false,
    increment = 30,
    onTimeSelect,
    selectedTime: selectedTimeInProps,
    showSeconds = false,
    startHour = 0,
    ...rest
  } = props;
  const { freeform } = rest;

  const { dateStartAnchor, dateEndAnchor } = useStableDateAnchor(
    dateAnchorInProps ?? selectedTimeInProps ?? defaultSelectedTimeInProps,
    startHour,
    endHour,
  );

  const options: TimePickerOption[] = React.useMemo(
    () =>
      getTimesBetween(dateStartAnchor, dateEndAnchor, increment).map(time => ({
        date: time,
        key: dateToKey(time),
        text: formatTimeString(time, { showSeconds, hour12 }),
      })),
    [dateStartAnchor, dateEndAnchor, increment, showSeconds, hour12],
  );

  const [selectedTime, setSelectedTime] = useControllableState<Date | undefined>({
    state: props.selectedTime,
    defaultState: props.defaultSelectedTime,
    initialState: undefined,
  });

  const selectedOptions = React.useMemo(() => {
    const selectedOption = options.find(date => date.key === dateToKey(selectedTime));
    return selectedOption ? [selectedOption.key] : [];
  }, [options, selectedTime]);

  const handleOptionSelect: ComboboxProps['onOptionSelect'] = React.useCallback(
    (e, data) => {
      if (freeform && data.optionValue === undefined) {
        // Combobox clears selection when input value not matching any option; but we allow this case in freeform TimePicker.
        return;
      }

      const timeSelectionData: TimeSelectionData = {
        selectedTime: keyToDate(data.optionValue),
        selectedTimeText: data.optionText,
      };
      onTimeSelect?.(e, timeSelectionData);
      setSelectedTime(timeSelectionData.selectedTime);
    },
    [freeform, onTimeSelect, setSelectedTime],
  );

  const state = useCombobox_unstable(
    {
      ...rest,
      selectedOptions,
      onOptionSelect: handleOptionSelect,
      children: options.map(date => (
        <Option key={date.key} value={date.key}>
          {date.text}
        </Option>
      )),
    },
    ref,
  );

  const {
    activeOption,
    setActiveOption,
    value,
    root: { onKeyDown: onKeyDownInState },
  } = state;

  // Combobox always shows activeOption in dropdown even if it doesn't match input value, and Enter key will select it.
  // For freeform TimePicker we allow the input value as the selected time. So we clear activeOption when input does not match any option.
  React.useEffect(() => {
    if (freeform && value && !options.find(({ text }) => text.indexOf(value) === 0)) {
      setActiveOption(undefined);
    }
  }, [freeform, options, setActiveOption, value]);

  const selectTimeFromValue = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (value) {
        const timeSelectionData: TimeSelectionData = {
          selectedTime: getDateFromTimeString(dateStartAnchor, value, hour12),
          selectedTimeText: value,
        };

        setSelectedTime(timeSelectionData.selectedTime);
        onTimeSelect?.(e, timeSelectionData);
      }
    },
    [dateStartAnchor, hour12, onTimeSelect, setSelectedTime, value],
  );

  const handleKeyDown: ComboboxProps['onKeyDown'] = React.useCallback(
    e => {
      if (freeform && !activeOption && (e.key === 'Enter' || e.key === 'Tab')) {
        selectTimeFromValue(e);
      }
      onKeyDownInState?.(e);
    },
    [activeOption, freeform, onKeyDownInState, selectTimeFromValue],
  );

  state.root.onKeyDown = handleKeyDown;

  return state;
};

/**
 * Provides stable start and end date anchors based on the provided date and time parameters.
 * The hook ensures that the memoization remains consistent even if new Date objects representing the same date are provided.
 */
const useStableDateAnchor = (providedDate: Date | undefined, startHour: Hour, endHour: Hour) => {
  const fallbackDateAnchorRef = React.useRef(new Date());

  // Convert the Date object to a stable key representation. This ensures that the memoization remains stable when a new Date object representing the same date is passed in.
  const dateAnchorKey = dateToKey(providedDate);
  const dateAnchor = React.useMemo(() => keyToDate(dateAnchorKey) ?? fallbackDateAnchorRef.current, [dateAnchorKey]);

  const dateStartAnchor = React.useMemo(() => getDateStartAnchor(dateAnchor, startHour), [dateAnchor, startHour]);
  const dateEndAnchor = React.useMemo(
    () => getDateEndAnchor(dateAnchor, startHour, endHour),
    [dateAnchor, endHour, startHour],
  );

  return { dateStartAnchor, dateEndAnchor };
};
