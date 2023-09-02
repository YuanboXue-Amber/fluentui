import * as React from 'react';
import { mount } from '@cypress/react';
import { useModalAttributes, UseModalAttributesOptions, useFocusFinders } from './hooks';
import root from 'react-shadow';

const ModalContainer: React.FC<{
  options: UseModalAttributesOptions;
}> = ({ options }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const { triggerAttributes, modalAttributes } = useModalAttributes(options);

  const onModalKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const [open, setOpen] = React.useState(false);

  const { findFirstFocusable } = useFocusFinders();
  React.useEffect(() => {
    if (open && modalRef.current) {
      findFirstFocusable(modalRef.current)?.focus();
    }
  }, [open, findFirstFocusable]);

  const modalContent = (
    <div
      id="modal"
      style={{ border: '3px dashed cornflowerblue', padding: 20 }}
      ref={modalRef}
      onKeyDown={onModalKeydown}
      {...modalAttributes}
    >
      <button id="button-1">button 1 inside</button>
      <button id="button-2">button 2 inside</button>
    </div>
  );

  return (
    <div style={{ border: '3px solid blue', padding: 20 }}>
      <button id="trigger-button" onClick={() => setOpen(v => !v)} ref={triggerRef} {...triggerAttributes}>
        trigger
      </button>
      {open && modalContent}
    </div>
  );
};

const TestWrapper: React.FC<{
  useShadowDOM: boolean;
  options: UseModalAttributesOptions;
}> = props => {
  const containerEl = <ModalContainer options={props.options} />;
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
    mount(<TestWrapper useShadowDOM={false} options={{ legacyTrapFocus: true, trapFocus: true }} />);

    cy.get('#trigger-button').click();
    cy.focused().should('have.attr', 'id', 'button-1');

    // focus traps in modal
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'button-2');
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'id', 'button-1');
    cy.realPress(['Shift', 'Tab']);
    cy.focused().should('have.attr', 'id', 'button-2');

    cy.realPress('Escape');
    cy.focused().should('have.attr', 'id', 'trigger-button');
    cy.get('#modal').should('not.exist');
  });

  it(`Modal within Shadow DOM should trap focus`, () => {
    mount(<TestWrapper useShadowDOM options={{ legacyTrapFocus: true, trapFocus: true }} />);

    cy.get('#shadow-host').shadow().find('#trigger-button').click();
    cy.get('#shadow-host').shadow().find('#button-1').should('have.focus');

    // focus traps in modal
    cy.realPress('Tab');
    cy.get('#shadow-host').shadow().find('#button-2').should('have.focus');
    // AMBER TODO: modal in shadow dom is not trapping focus
    cy.realPress('Tab');
    cy.get('#shadow-host').shadow().find('#button-1').should('have.focus');
  });
});
