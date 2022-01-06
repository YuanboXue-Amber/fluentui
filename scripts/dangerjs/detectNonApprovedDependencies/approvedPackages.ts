export default [
  '@babel/runtime@7.1.2',
  '@babel/runtime@7.4.5',
  '@babel/runtime@7.7.6',
  '@babel/runtime@7.10.4',
  '@emotion/hash@0.7.4',
  '@emotion/memoize@0.7.4',
  '@emotion/serialize@0.11.15',
  '@emotion/unitless@0.7.5',
  '@emotion/utils@0.11.3',
  '@uifabric/merge-styles@7.19.1',
  '@uifabric/set-version@7.0.23',
  '@uifabric/utilities@7.32.3',
  'body-scroll-lock@3.1.5',
  'classnames@2.2.6',
  'compute-scroll-into-view@1.0.11',
  'css-in-js-utils@2.0.1',
  'css-in-js-utils@3.0.0',
  'cssjanus@1.3.0',
  'dom-helpers@5.1.3',
  'downshift@3.2.6',
  'downshift@3.2.10',
  'downshift@3.2.14',
  'downshift@5.0.5',
  'fast-loops@1.0.1',
  'fast-memoize@2.5.1',
  'fbjs@0.8.17',
  'fela-bindings@10.1.3',
  'fela-bindings@10.2.0',
  'fela-bindings@10.5.0',
  'fela-bindings@10.6.1',
  'fela-dom@7.0.9',
  'fela-dom@10.1.3',
  'fela-dom@10.2.0',
  'fela-dom@10.5.0',
  'fela-dom@10.6.1',
  'fela-plugin-custom-property@7.0.4',
  'fela-plugin-custom-property@10.2.0',
  'fela-plugin-custom-property@10.5.0',
  'fela-plugin-custom-property@10.6.1',
  'fela-plugin-embedded@10.5.0',
  'fela-plugin-embedded@10.6.1',
  'fela-plugin-expand-shorthand@10.6.1',
  'fela-plugin-fallback-value@10.2.0',
  'fela-plugin-fallback-value@10.5.0',
  'fela-plugin-fallback-value@10.6.1',
  'fela-plugin-placeholder-prefixer@5.0.20',
  'fela-plugin-placeholder-prefixer@10.2.0',
  'fela-plugin-placeholder-prefixer@10.5.0',
  'fela-plugin-placeholder-prefixer@10.6.1',
  'fela-plugin-prefixer@5.0.20',
  'fela-plugin-prefixer@10.2.0',
  'fela-plugin-prefixer@10.5.0',
  'fela-plugin-prefixer@10.6.1',
  'fela-plugin-rtl@10.2.0',
  'fela-plugin-rtl@10.5.0',
  'fela-plugin-rtl@10.6.1',
  'fela-tools@5.2.2',
  'fela-tools@10.1.3',
  'fela-tools@10.2.0',
  'fela-tools@10.5.0',
  'fela-tools@10.6.1',
  'fela-utils@8.1.2',
  'fela-utils@10.1.3',
  'fela-utils@10.5.0',
  'fela-utils@10.6.1',
  'fela@6.2.2',
  'fela@10.2.0',
  'fela@10.5.0',
  'fela@10.6.1',
  'hyphenate-style-name@1.0.2',
  'inline-style-expand-shorthand@1.1.3',
  'inline-style-expand-shorthand@1.2.0',
  'inline-style-prefixer@5.0.3',
  'inline-style-prefixer@5.1.0',
  'isobject@3.0.1',
  'keyboard-key@1.0.1',
  'lodash@4.17.5',
  'lodash@4.17.11',
  'lodash@4.17.15',
  'lodash-es@4.17.15',
  'object-assign@4.1.1',
  'popper.js@1.15.0',
  '@popperjs/core@2.1.1',
  '@popperjs/core@2.4.0',
  '@popperjs/core@2.4.2',
  '@popperjs/core@2.4.3',
  'prop-types@15.6.2',
  'prop-types@15.7.2',
  'raf-schd@4.0.2',
  'react-addons-shallow-compare@15.6.2',
  'react-dom@16.8.3',
  'react-fela@7.3.1',
  'react-fela@10.2.0',
  'react-fela@10.5.0',
  'react-fela@10.6.1',
  'react-is@16.8.2',
  'react-is@16.9.0',
  'react-resize-detector@4.2.0',
  'react-transition-group@4.4.1',
  'react@16.8.3',
  'resize-observer-polyfill@1.5.1',
  'rtl-css-js@1.11.0',
  'scheduler@0.13.3',
  'scheduler@0.13.6',
  'stylis@3.5.4',
  'stylis-plugin-rtl@1.0.0',
  'tslib@1.10.0',
  'webpack@4.25.1',
];

export const isIgnored = (packageId: string): boolean => {
  return packageId.startsWith('@fluentui/');
};
