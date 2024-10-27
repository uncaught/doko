import React, {ReactElement} from 'react';
import {Header} from 'semantic-ui-react';
import InputInvitation from './InputInvitation';
import ScanInvitation from './ScanInvitation';

export default function CashInvitation(): ReactElement {
  return (
    <section className='u-relative u-overflow-hidden'>
      <Header as='h4'>Einladung einlösen</Header>
      <ScanInvitation />
      <InputInvitation />
    </section>
  );
}
