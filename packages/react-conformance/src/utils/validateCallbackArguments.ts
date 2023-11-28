import { getCallbackArguments } from './getCallbackArguments';
import type { ArgumentValue } from './getCallbackArguments';

export type ValidateEventArgumentOptions = {
  forceGenericEventTypes: boolean;
};

function validateEventArgument(value: ArgumentValue | ArgumentValue[], options: ValidateEventArgumentOptions): void {
  const normalizedValue = Array.isArray(value) ? value : [value];

  normalizedValue.forEach(valueInUnion => {
    if (typeof valueInUnion === 'undefined') {
      return;
    }

    if (typeof valueInUnion === 'string') {
      if (valueInUnion === 'Event' || valueInUnion === 'React.SyntheticEvent') {
        if (options.forceGenericEventTypes) {
          return;
        } else {
          throw new Error(
            [
              'A first (event) argument cannot use generic React.SyntheticEvent or Event types.',
              'Please use more specific types like React.MouseEvent/MouseEvent',
            ].join(' '),
          );
        }
      }

      if (valueInUnion.endsWith('Event')) {
        if (options.forceGenericEventTypes) {
          throw new Error(
            [
              'A first (event) argument must use generic `React.SyntheticEvent | Event` type.',
              'Please use `EventHandler` to type the callback',
            ].join(' '),
          );
        } else {
          return;
        }
      }
    }

    throw new Error(
      options.forceGenericEventTypes
        ? 'A first (event) argument may only have type `React.SyntheticEvent | Event`. Please use `EventHandler` to type the callback'
        : `A first (event) argument may only have type "undefined", React.*Event or *Event`,
    );
  });
}

function validateDataArgument(value: ArgumentValue | ArgumentValue[]): void {
  if (Array.isArray(value)) {
    throw new Error('A second (data) argument cannot be a union');
  }

  if (value === null || typeof value !== 'object') {
    throw new Error('A second (data) argument should be represented by a type declaration or interface');
  }
}

export function validateCallbackArguments(
  callbackArguments: ReturnType<typeof getCallbackArguments>,
  validateEventArgumentOptions: ValidateEventArgumentOptions,
): void {
  const argumentNames = Object.keys(callbackArguments);

  if (argumentNames.length !== 2) {
    throw new Error(`A callback should have two arguments, it has ${argumentNames.length}`);
  }

  validateEventArgument(callbackArguments[0][1], validateEventArgumentOptions);
  validateDataArgument(callbackArguments[1][1]);
}
