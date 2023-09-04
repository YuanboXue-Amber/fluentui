import * as React from 'react';
import root from 'react-shadow';
import { useTabster } from '../../../../../react-tabster/src/hooks/useTabster';

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

export const LightDOM = () => {
  return <TestWrapper useShadowDOM={false} />;
};
