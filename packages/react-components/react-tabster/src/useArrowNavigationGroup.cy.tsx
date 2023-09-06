import * as React from 'react';
import { mount } from '@cypress/react';
import { useArrowNavigationGroup, UseArrowNavigationGroupOptions, useUncontrolled } from './hooks';
import root from 'react-shadow';

const SimpleGroup = (attributes: React.HTMLAttributes<HTMLDivElement>) => (
  <div id="arrow-navigation-group" style={{ border: '3px solid blue', padding: 20 }} {...attributes}>
    <button id="button-1">button 1 inside</button>
    <button id="button-2">button 2 inside</button>
    <button id="button-3">button 2 inside</button>
  </div>
);

const ArrowNavigationGroup: React.FC<{
  options: UseArrowNavigationGroupOptions;
}> = ({ options }) => {
  const attributes = useArrowNavigationGroup(options);
  return <SimpleGroup {...attributes} />;
};

const TestWrapper: React.FC<{
  useShadowDOM: boolean;
  options: UseArrowNavigationGroupOptions;
}> = props => {
  const containerEl = <ArrowNavigationGroup options={props.options} />;
  const uncontrolled = useUncontrolled();
  return (
    <div style={{ border: '3px solid green', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3>using Shadow DOM: {props.useShadowDOM ? '✅' : '❌'}</h3>

      {props.useShadowDOM ? (
        <root.div id="shadow-host" {...uncontrolled}>
          {containerEl}
        </root.div>
      ) : (
        containerEl
      )}

      <div id="outside-area" style={{ border: '3px solid olive', padding: 20 }}>
        <button id="outside-button">a button outside</button>
      </div>
    </div>
  );
};

describe('useArrowNavigationGroup', () => {
  it('everything should work within Light DOM', () => {
    mount(
      <TestWrapper
        useShadowDOM={false}
        options={{
          axis: 'horizontal',
          circular: true,
          memorizeCurrent: true,
        }}
      />,
    );

    cy.get('#outside-button').click().realPress(['Shift', 'Tab']);
    cy.focused().should('have.attr', 'id', 'button-3');

    cy.realPress('ArrowLeft');
    cy.focused().should('have.attr', 'id', 'button-2');
    cy.realPress('ArrowLeft');
    cy.focused().should('have.attr', 'id', 'button-1');
    cy.realPress('ArrowLeft');
    cy.focused().should('have.attr', 'id', 'button-3');

    cy.realPress('ArrowRight');
    cy.focused().should('have.attr', 'id', 'button-1');
    cy.realPress('ArrowRight');
    cy.focused().should('have.attr', 'id', 'button-2');

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'outside-button');

    cy.realPress(['Shift', 'Tab']);
    cy.focused().should('have.attr', 'id', 'button-2');
  });

  it(`Arrow should work within Shadow DOM`, () => {
    mount(
      <TestWrapper
        useShadowDOM
        options={{
          axis: 'horizontal',
          circular: true,
          memorizeCurrent: true,
        }}
      />,
    );

    cy.get('#shadow-host').shadow().find('#button-1').click();
    cy.get('#shadow-host').shadow().find('#button-1').should('have.focus');

    // AMBER TODO: arrow navigation doesn't work even when focus is set on button within shadow DOM
    cy.realPress('ArrowRight');
    cy.get('#shadow-host').shadow().find('#button-2').should('have.focus');
  });
});
