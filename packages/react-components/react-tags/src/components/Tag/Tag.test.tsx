import * as React from 'react';
import { Tag } from './Tag';
import { isConformant } from '../../testing/isConformant';
import { TagProps } from './Tag.types';
import { render, fireEvent } from '@testing-library/react';

const requiredProps: TagProps = {
  dismissible: true,
};

describe('Tag', () => {
  isConformant({
    Component: Tag,
    displayName: 'Tag',
    requiredProps,
    disabledTests: [
      // onDismiss: A second (data) argument is not needed
      'consistent-callback-args',
    ],
  });

  it('should invoke onDismiss on dismiss button click', () => {
    const onDismiss = jest.fn();
    const { getByRole } = render(
      <Tag dismissible onDismiss={onDismiss}>
        Tag
      </Tag>,
    );

    fireEvent.click(getByRole('button'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should invoke onDismiss on dismiss button delete keyDown', () => {
    const onDismiss = jest.fn();
    const { getByRole } = render(
      <Tag dismissible onDismiss={onDismiss}>
        Tag
      </Tag>,
    );

    fireEvent.keyDown(getByRole('button'), { key: 'Delete' });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  // TODO add more tests here, and create visual regression tests in /apps/vr-tests
});
