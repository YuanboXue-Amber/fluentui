import { Button, Dialog, Image } from '@fluentui/react-northstar';
import * as React from 'react';

const content = `a`;

const DialogExample = () => (
  <Dialog
    cancelButton="Cancel"
    confirmButton="Confirm"
    header="Action confirmation"
    content={
      <div>
        {content}
        <Image
          src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/CarolePoland.jpg"
          style={{ height: '500px', width: '500px' }}
        />
      </div>
    }
    trigger={<Button content="Open a dialog" />}
  />
);

export default DialogExample;
