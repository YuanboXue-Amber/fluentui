import * as React from 'react';
import { mergeCallbacks, useControllableState, useMergedRefs } from '@fluentui/react-utilities';
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
  const { freeform = false } = rest;

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

  const selectedTimeTextRef = React.useRef<string | undefined>(undefined);

  const selectTime: TimePickerProps['onTimeSelect'] = React.useCallback(
    (e, data) => {
      setSelectedTime(data.selectedTime);
      selectedTimeTextRef.current = data.selectedTimeText;
      onTimeSelect?.(e, data);
    },
    [onTimeSelect, setSelectedTime],
  );

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
      selectTime(e, timeSelectionData);
    },
    [freeform, selectTime],
  );

  const baseState = useCombobox_unstable(
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

  const state: TimePickerState = {
    ...baseState,
    dateStartAnchor,
    freeform,
    hour12,
    selectedTimeTextRef,
  };

  useSelectTimeFromValue(state, selectTime);

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

/**
 * Mimics the behavior of the browser's change event for a freeform TimePicker.
 * The provided callback is called when input changed and:
 * - Enter/Tab key is pressed on the input.
 * - TimePicker loses focus, signifying a possible change.
 */
const useSelectTimeFromValue = (state: TimePickerState, callback: TimePickerProps['onTimeSelect']) => {
  const {
    activeOption,
    setActiveOption,
    value,
    setValue,
    options,
    dateStartAnchor,
    freeform,
    hour12,
    selectedTimeTextRef,
  } = state;

  // Base Combobox has activeOption default to first option in dropdown even if it doesn't match input value, and Enter key will select it.
  // This effect ensures that the activeOption is cleared when the input doesn't match any option.
  // This behavior is specific to a freeform TimePicker where the input value is treated as a valid time even if it's not in the dropdown.
  React.useEffect(() => {
    if (freeform && value && !options.find(({ text }) => text.indexOf(value) === 0)) {
      setActiveOption(undefined);
    }
  }, [freeform, options, setActiveOption, value]);

  const selectTimeFromValue = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
      if (!freeform) {
        return;
      }

      // TODO: maybe instead of finding an option, we just format the selectedTime and use that as the selectedTimeText?
      const selectedTime = value ? getDateFromTimeString(dateStartAnchor, value, hour12) : undefined;
      const selectedOption = selectedTime
        ? options.find(option => option.value === dateToKey(selectedTime))
        : undefined;
      const selectedTimeText = selectedOption ? selectedOption.text : value;

      if (selectedTimeText !== value) {
        setValue(selectedTimeText);
      }

      if (selectedTimeTextRef.current !== selectedTimeText) {
        callback?.(e, { selectedTime, selectedTimeText });
      }
    },
    [callback, dateStartAnchor, freeform, hour12, options, selectedTimeTextRef, setValue, value],
  );

  const handleKeyDown: ComboboxProps['onKeyDown'] = React.useCallback(
    e => {
      if (!activeOption && (e.key === 'Enter' || e.key === 'Tab')) {
        selectTimeFromValue(e);
      }
    },
    [activeOption, selectTimeFromValue],
  );
  state.root.onKeyDown = mergeCallbacks(handleKeyDown, state.root.onKeyDown);

  const rootRef = React.useRef<HTMLDivElement>(null);
  state.root.ref = useMergedRefs(state.root.ref, rootRef);

  const listboxRef = React.useRef<HTMLDivElement>(null);
  const mergedListboxRef = useMergedRefs(state.listbox?.ref, listboxRef);
  if (state.listbox) {
    state.listbox.ref = mergedListboxRef;
    state.listbox.tabIndex = -1; // allows it to be the relatedTarget of a blur event.
  }

  if (state.expandIcon) {
    state.expandIcon.tabIndex = -1; // allows it to be the relatedTarget of a blur event.
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const isOutside = e.relatedTarget
      ? [rootRef, listboxRef].every(({ current }) => !current?.contains(e.relatedTarget as HTMLElement))
      : true;
    if (isOutside) {
      selectTimeFromValue(e);
    }
  };
  state.input.onBlur = mergeCallbacks(handleInputBlur, state.input.onBlur);
};
