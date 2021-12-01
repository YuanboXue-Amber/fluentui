# @fluentui/jest-make-styles

**Jest Make Styles for [Fluent UI React](https://developer.microsoft.com/en-us/fluentui)**

Jest utilities for makeStyles

There are two functions that can be used for testing if styles are applied correctly to a component.
It is especially useful when styles are applied conditionally through `mergeClasses`:

For this below example component:

```tsx
const useStyles1 = makeStyles({
  root: theme => ({
    color: theme.colorNeutralForeground1,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  isTopAligned: {
    verticalAlign: 'top',
  },
});

const TestComponent = ({ id, isTopAligned }: { id?: string; isTopAligned?: boolean }) => {
  const styles1 = useStyles1();
  const className = mergeClasses(styles1.root, isTopAligned && styles1.isTopAligned);
  return <div data-testid={id} className={className} />;
};
```

1. `toContainStyles` - Test that component contains some styles

Example test:

```tsx
describe('Test component', () => {
  it('should merge correct styles', () => {
    const wrapper = shallow(<Test id="test" isTopAligned={false} />);
    expect(wrapper.find('[data-testid="test"]').prop('className')).toContainStyles({
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'top', // ❌  TestComponent does not have this style
    });
  });
});
```

Test result:

![](./toContain.png)

The below test will pass:

```tsx
describe('Test component', () => {
  it('should merge correct styles', () => {
    const wrapper = shallow(<Test id="test" isTopAligned />);
    expect(wrapper.find('[data-testid="test"]').prop('className')).toContainStyles({
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'top', // ✅ applied because isTopAligned=true
    });
  });
});
```

2. `toHaveEqualStyles` - Test that all styles are present

Example test:

```tsx
describe('Test component', () => {
  it('should merge correct styles', () => {
    const wrapper = shallow(<Test id="test" isTopAligned={false} />);
    expect(wrapper.find('[data-testid="test"]').prop('className')).toHaveEqualStyles({
      // ❌ missing color style
      alignItems: 'center',
      justifyContent: 'center',
    });
  });
});
```

Test result:

![](./toHaveEqual.png)
