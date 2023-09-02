import * as React from 'react';
import { mount } from '@cypress/react';
import { useFocusableGroup, UseFocusableGroupOptions } from './hooks';
import root from 'react-shadow';

const SimpleGroup = (attributes: React.HTMLAttributes<HTMLDivElement>) => (
  <div style={{ border: '3px solid blue', padding: 20 }}>
    <button id="helper-button-inside">helper button inside shadow root</button>
    <div id="focusable-group" style={{ border: '3px dashed cornflowerblue', padding: 20 }} {...attributes} tabIndex={0}>
      <button id="button-1">button 1 inside</button>
      <button id="button-2">button 2 inside</button>
      <button id="button-3">button 3 inside</button>
    </div>
  </div>
);

const FocusableGroup: React.FC<{
  options: UseFocusableGroupOptions;
}> = ({ options }) => {
  const attributes = useFocusableGroup(options);
  return <SimpleGroup {...attributes} />;
};

const TestWrapper: React.FC<{
  useShadowDOM: boolean;
  options: UseFocusableGroupOptions;
}> = props => {
  const containerEl = <FocusableGroup options={props.options} />;
  return (
    <div style={{ border: '3px solid green', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3>using Shadow DOM: {props.useShadowDOM ? '✅' : '❌'}</h3>

      {props.useShadowDOM ? <root.div id="shadow-host">{containerEl}</root.div> : containerEl}

      <div id="outside-area" style={{ border: '3px solid olive', padding: 20 }}>
        <button id="outside-button">a button outside</button>
      </div>
    </div>
  );
};

describe('useFocusableGroup', () => {
  it('everything should work within Light DOM', () => {
    mount(
      <TestWrapper
        useShadowDOM={false}
        options={{
          tabBehavior: 'limited-trap-focus',
        }}
      />,
    );

    cy.get('#outside-button').click().realPress(['Shift', 'Tab']);
    cy.focused().should('have.attr', 'id', 'focusable-group');

    cy.realPress('Enter');
    cy.focused().should('have.attr', 'id', 'button-1');

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'button-2');
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'button-3');
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'button-1');

    cy.realPress(['Shift', 'Tab']);
    cy.focused().should('have.attr', 'id', 'button-3');
    cy.realPress(['Shift', 'Tab']);
    cy.focused().should('have.attr', 'id', 'button-2');

    cy.realPress('Escape');
    cy.focused().should('have.attr', 'id', 'focusable-group');

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'outside-button');
  });

  it(`Enter into focusable group should work within Shadow DOM`, () => {
    mount(
      <TestWrapper
        useShadowDOM
        options={{
          tabBehavior: 'limited-trap-focus',
        }}
      />,
    );

    cy.get('#shadow-host').shadow().find('#helper-button-inside').click();
    cy.get('#shadow-host').shadow().find('#helper-button-inside').should('have.focus');

    cy.realPress('Tab');
    cy.get('#shadow-host').shadow().find('#focusable-group').should('have.focus');

    // AMBER TODO: Grouper enter key doesn't work
    cy.realPress('Enter');
    cy.get('#shadow-host').shadow().find('#button-1').should('have.focus');
  });
});
