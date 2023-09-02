import * as React from 'react';
import { mount } from '@cypress/react';
import root from 'react-shadow';
import { useTabster } from './hooks/useTabster';

type SimpleContainerProps = { containerId?: string };
const SimpleContainer: React.FC<SimpleContainerProps> = ({ containerId }) => (
  <div style={{ border: '3px solid blue', padding: 20 }}>
    <button id={`${containerId}-inside-button-first`}>button inside</button>
    <button id={`${containerId}-inside-button-last`}>last button inside</button>
  </div>
);

const ContainerWithTabster: React.FC<SimpleContainerProps> = props => {
  useTabster();
  return <SimpleContainer {...props} />;
};

const ContainerElement: React.FC<{
  useShadowDOM: boolean;
  id: string;
  disableTabster?: boolean;
}> = ({ useShadowDOM, id, disableTabster }) => {
  const ContainerComponent = disableTabster ? SimpleContainer : ContainerWithTabster;
  const containerId = useShadowDOM ? `shadow-${id}` : id;

  return useShadowDOM ? (
    <root.div id={containerId}>
      container: {containerId}
      <ContainerComponent containerId={containerId} />
    </root.div>
  ) : (
    <div id={containerId}>
      container: {containerId}
      <ContainerComponent containerId={containerId} />
    </div>
  );
};

const TestWrapper: React.FC<{
  useShadowDOM: boolean;
  disableTabster?: boolean;
}> = ({ useShadowDOM, disableTabster }) => {
  return (
    <div style={{ border: '3px solid green', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3>using Shadow DOM: {useShadowDOM ? '✅' : '❌'}</h3>

      <ContainerElement useShadowDOM={useShadowDOM} id="container-1" disableTabster={disableTabster} />

      <div id="outside-area" style={{ border: '3px solid olive', padding: 20 }}>
        <button id="outside-button">a button outside</button>
      </div>

      <ContainerElement useShadowDOM={useShadowDOM} id="container-2" disableTabster={disableTabster} />

      <ContainerElement useShadowDOM={useShadowDOM} id="container-3" disableTabster={disableTabster} />
    </div>
  );
};

describe('useArrowNavigationGroup', () => {
  it('should work within Light DOM', () => {
    mount(<TestWrapper useShadowDOM={false} />);

    // Shift+Tab from outside to inside
    cy.get('#outside-button').click().realPress(['Shift', 'Tab']);
    cy.focused().should('have.attr', 'id', 'container-1-inside-button-last');

    // Shift+Tab within the container
    cy.realPress(['Shift', 'Tab']);
    cy.focused().should('have.attr', 'id', 'container-1-inside-button-first');

    // Tab within the container
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'container-1-inside-button-last');

    // Tab from inside to outside
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'outside-button');

    // Tab from outside to inside
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'container-2-inside-button-first');

    // Tab from inside shadow to another shadow
    cy.get('#container-2-inside-button-last').click().realPress('Tab');
    cy.focused().should('have.attr', 'id', 'container-3-inside-button-first');
  });

  [true, false].forEach(disableTabster => {
    it(`should Shift+Tab from outside to Shadow DOM when disableTabster:${disableTabster}`, () => {
      mount(<TestWrapper useShadowDOM disableTabster={disableTabster} />);

      // AMBER TODO: stops working just by initializing tabster
      cy.get('#outside-button').click().realPress(['Shift', 'Tab']);
      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-last').should('have.focus');
    });

    it(`should Shift+Tab within the Shadow DOM when disableTabster:${disableTabster}`, () => {
      mount(<TestWrapper useShadowDOM disableTabster={disableTabster} />);

      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-last').click();
      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-last').should('have.focus');

      // AMBER TODO: stops working just by initializing tabster
      cy.realPress(['Shift', 'Tab']);
      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-first').should('have.focus');
    });

    it(`should Tab within the Shadow DOM when disableTabster:${disableTabster}`, () => {
      mount(<TestWrapper useShadowDOM disableTabster={disableTabster} />);

      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-first').click();
      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-first').should('have.focus');

      cy.realPress('Tab');
      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-last').should('have.focus');
    });

    it(`should Tab from Shadow DOM to outside when disableTabster:${disableTabster}`, () => {
      mount(<TestWrapper useShadowDOM disableTabster={disableTabster} />);

      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-last').click();
      cy.get('#shadow-container-1').shadow().find('#shadow-container-1-inside-button-last').should('have.focus');

      cy.realPress('Tab');
      cy.focused().should('have.attr', 'id', 'outside-button');
    });

    it(`should Tab from outside to Shadow DOM when disableTabster:${disableTabster}`, () => {
      mount(<TestWrapper useShadowDOM disableTabster={disableTabster} />);

      // AMBER TODO: stops working just by initializing tabster
      cy.get('#outside-button').click().realPress('Tab');
      cy.get('#shadow-container-2').shadow().find('#shadow-container-2-inside-button-first').should('have.focus');
    });

    it(`should Tab from within Shadow root to within another Shadow root when disableTabster:${disableTabster}`, () => {
      mount(<TestWrapper useShadowDOM disableTabster={disableTabster} />);

      cy.get('#shadow-container-2').shadow().find('#shadow-container-2-inside-button-last').click();
      cy.get('#shadow-container-2').shadow().find('#shadow-container-2-inside-button-last').should('have.focus');

      // AMBER TODO: stops working just by initializing tabster
      cy.realPress('Tab');
      cy.get('#shadow-container-3').shadow().find('#shadow-container-3-inside-button-first').should('have.focus');
    });
  });
});
