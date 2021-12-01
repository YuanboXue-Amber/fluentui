import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { mergeClasses, makeStyles } from '@fluentui/react-make-styles';
import {
  MakeStyles,
  resolveStyleRules,
  CSSRulesByBucket,
  getStyleInfoByClassNames,
  expandShorthand,
  resolveProxyValues,
} from '@fluentui/make-styles';
import { diff } from 'jest-diff';
import { ProviderContext } from '../../react-shared-contexts/src/index';

const useStyles12 = makeStyles({
  root: theme => ({
    color: theme.colorNeutralForeground1,
    alignItems: 'center',
    justifyContent: 'center',
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

const addNoflipAnnotation = (styles: MakeStyles) => {
  Object.keys(styles).forEach(key => {
    if (typeof styles[key] === 'object') {
      addNoflipAnnotation(styles[key]);
    } else {
      styles[key] = styles[key] + '  /* @noflip */';
    }
  });
};

const RtlWrapper: React.FC = ({ children }) => (
  <ProviderContext.Provider value={{ dir: 'rtl', targetDocument: document }}>{children}</ProviderContext.Provider>
);
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

    // addNoflipAnnotation(expected);
    const expectedStylesByBucket: CSSRulesByBucket = resolveStyleRules('', expected)[1];
    const expectedRules: string[] = Object.values(expectedStylesByBucket)
      .reduce<string[]>((acc, current) => {
        return current ? [...acc, ...current] : acc;
      }, [])
      .filter(Boolean)
      .sort();

    const diffResult = diff(receivedRules.join('\n'), expectedRules.join('\n'), {
      expand: false,
      includeChangeCounts: true,
    });

    if (diffResult!.indexOf('Compared values have no visual difference.') >= 0) {
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
      // expectedRules styles:
      // ${JSON.stringify(expectedRules, null, 2)}

      // receivedRules styles:
      // ${JSON.stringify(receivedRules, null, 2)}

      // `,
    };
  },
});

describe('Test component', () => {
  it('should merge correct styles', () => {
    const wrapper = mount(
      <RtlWrapper>
        <Test id="test" />)
      </RtlWrapper>,
    );
    // expect(wrapper.find('#test')).toHaveStyle({
    //   display: 'none',
    //   paddingLeft: '10px',
    //   // paddingRight: '20px',
    // });
    // const myStuff = getInfoByClassNames(wrapper.prop('className').split(' '));
    expect(wrapper.find('[data-testid="test"]').prop('className')).toHaveEqualStyles({
      alignItems: 'center',
      justifyContent: 'center',
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
