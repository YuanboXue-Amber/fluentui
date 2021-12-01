import * as React from 'react';
import { shallow } from 'enzyme';
import { mergeClasses, makeStyles } from '@fluentui/react-make-styles';
import { MakeStyles, resolveStyleRules, CSSRulesByBucket, getStyleInfoByClassNames } from '@fluentui/make-styles';
import { diff } from 'jest-diff';

const useStyles1 = makeStyles({
  root: theme => ({
    color: theme.colorNeutralForeground1,
    border: 'solid',
    margin: '20px',
    // '&:hover': { margin: '20px' },
    backgroundColor: 'red',
    //
    width: '1.6rem',
    maxWidth: '1.6rem',
    minWidth: '1.6rem',
    maxHeight: '1.6rem',
    height: '1.6rem',
    padding: 0,
    borderWidth: '.1rem',
    borderColor: 'rgba(37,36,36,0.2)',
    '&:hover': {
      borderColor: 'rgba(37,36,36,0.2)',
    },
    marginTop: 0,
    marginRight: '.4rem',
    backfaceVisibility: 'hidden',
    boxShadow: 'none',
    justifySelf: 'end',
    alignSelf: 'center',
  }),
  paddingLeft: {
    paddingLeft: '10px',
  },
  padding: {
    padding: '20px',
  },
  padding1: {
    padding: '20px',
  },
});

const Test = ({ id }: { id?: string }) => {
  const styles1 = useStyles1();
  const styles = mergeClasses('static-class', styles1.root, styles1.paddingLeft, styles1.padding, styles1.padding1);
  return <div data-testid={id} className={styles1.root} />;
};

// const rtlWrapper: React.FC = ({ children }) => (
//   <ProviderContext.Provider value={{ dir: 'rtl', targetDocument: document }}>{children}</ProviderContext.Provider>
// );
// TODO accept string className
expect.extend({
  toHaveEqualStyles: (classNames: string, expected: MakeStyles) => {
    const styleInfo = getStyleInfoByClassNames(classNames.split(/\s+/));
    if (!styleInfo) {
      return { pass: false, message: () => `no styles found for classNames ${classNames}` };
    }
    const receivedRules: string[] = Object.values(styleInfo.sequences)
      .reduce<string[]>((acc, current) => {
        return [...acc, ...current.rules.map(rule => rule.cssRule)];
      }, [])
      .sort();

    const resolvedExpected: CSSRulesByBucket = resolveStyleRules('', expected)[1];
    const expectedRules: string[] = Object.values(resolvedExpected)
      .reduce<string[]>((acc, current) => {
        return current ? [...acc, ...current] : acc;
      }, [])
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .sort();

    const diffResult = diff(receivedRules.join('\n'), expectedRules.join('\n'), {
      expand: false,
      includeChangeCounts: true,
    });

    if (diffResult === 'Compared values have no visual difference.') {
      return { pass: true, message: () => '' };
    }

    return {
      pass: false,
      message: () =>
        `Unmatched atomic styles found!
Expected styles:
${JSON.stringify(expected, null, 2)}

Unmatched atomic styles:
${diffResult}
`,
    };
  },
});

describe('make-styles', () => {
  it('should check styles', () => {
    const wrapper = shallow(<Test id="test" />);
    // expect(wrapper.find('#test')).toHaveStyle({
    //   display: 'none',
    //   paddingLeft: '10px',
    //   // paddingRight: '20px',
    // });
    // const myStuff = getInfoByClassNames(wrapper.prop('className').split(' '));
    expect(wrapper.prop('className')).toHaveEqualStyles({
      // border: 'solid',
      margin: '20px',
      background: 'red',
      //
      width: '1.6rem',
      maxWidth: '1.6rem',
      minWidth: '1.6rem',
      maxHeight: '1.6rem',
      height: '1.6rem',
      padding: 0,
      borderWidth: '.1rem',
      borderColor: 'rgba(37,36,36,0.2)',
      '&:hover': {
        borderColor: 'rgba(37,36,36,0.2)',
      },
      marginTop: 0,
      marginRight: '.4rem',
      backfaceVisibility: 'hidden',
      boxShadow: 'none',
      justifySelf: 'end',
      alignSelf: 'center',
    });
  });
});

// const shouldDive = node => typeof node.dive === 'function' && typeof node.type() !== 'string';

// const isTagWithClassName = node => node.exists() && node.prop('className') && typeof node.type() === 'string';

// const hasClassName = node =>
//   node.length > 0 &&
//   typeof node.props === 'function' &&
//   node.prop('className') &&
//   isStyledClass(node.prop('className'));

// const getClassNames = received => {
//   let className;

//   if (received) {
//     if (received.$$typeof === Symbol.for('react.test.json')) {
//       className = received.props.className || received.props.class;
//     } else if (hasClassName(received)) {
//       className = received.prop('className');
//     } else if (typeof received.exists === 'function' && received.exists()) {
//       const tree = shouldDive(received) ? received.dive() : received;
//       const components = tree.findWhere(isTagWithClassName);
//       if (components.length) {
//         className = components.first().prop('className');
//       }
//     } else if (global.Element && received instanceof global.Element) {
//       className = Array.from(received.classList).join(' ');
//     }
//   }

//   return className ? className.split(/\s/) : [];
// };
