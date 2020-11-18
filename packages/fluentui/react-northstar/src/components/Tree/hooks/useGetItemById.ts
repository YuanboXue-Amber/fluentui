import * as React from 'react';
import { FlatTree, FlatTreeItem } from './flattenTree';

export type GetItemById = (id: string) => FlatTreeItem;

/**
 * This hook returns a stable `getItemById()` function that will lookup in latest `flatTree`.
 * This is used used to have stable callbacks that can be passed to React's Context.
 */
export function useGetItemById(flatTree: FlatTree): GetItemById {
  // An exception is thrown there to ensure that a proper callback will assigned to ref
  const callbackRef = React.useRef<GetItemById>(() => {
    throw new Error('Callback is not assigned yet');
  });

  // We are assigning a callback during render as it can be used during render and in event handlers. In dev mode we
  // are freezing objects to prevent their mutations
  callbackRef.current = itemId =>
    process.env.NODE === 'production' ? flatTree[itemId] : Object.freeze(flatTree[itemId]);

  return React.useCallback<GetItemById>((...args) => {
    return callbackRef.current(...args);
  }, []);
}
