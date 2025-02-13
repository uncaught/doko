import {generateInvitationUrl} from '@doko/common';
import {QRCodeCanvas} from 'qrcode.react';
import React, {ReactElement, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Button, Header, Icon, Modal, Segment} from 'semantic-ui-react';
import {useCreateInvitation} from '../../store/GroupMembers';
import {usedInvitationTokensSelector} from '../../store/Ui';

const canShare = typeof window.navigator.share === 'function';

export default function InviteDevice(): ReactElement {
  const [isLoading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showQrSuccess, setShowQrSuccess] = useState(false);
  const [invitationToken, setInvitationToken] = useState('');
  const [invitationUrl, setInvitationUrl] = useState('');
  const createInvitation = useCreateInvitation();
  const usedInvitationTokens = useSelector(usedInvitationTokensSelector);

  const generateCode = async () => {
    if (isLoading) {
      return;
    }
    setShowQr(false);
    setShowQrSuccess(false);
    setLoading(true);
    try {
      const token = await createInvitation();
      const url = generateInvitationUrl(window.location.hostname, token);
      setInvitationToken(token);
      setInvitationUrl(url);
      return url;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let disposed = false;
    if (invitationToken && usedInvitationTokens.includes(invitationToken) && showQr) {
      setShowQrSuccess(true);
      setTimeout(() => {
        if (!disposed) {
          setShowQr(false);
          setShowQrSuccess(false);
        }
      }, 1000);
    }
    return () => {
      disposed = true;
    };
  }, [invitationToken, showQr, usedInvitationTokens]);

  return (
    <section className='u-relative u-overflow-hidden'>
      <Header as={'h4'}>Einladen/Verbinden</Header>
      {canShare && (
        <Button
          icon
          floated='right'
          labelPosition='left'
          color={'blue'}
          onClick={async () => navigator.share!({url: await generateCode()})}
          loading={isLoading}
        >
          <Icon name='share alternate' />
          Teilen
        </Button>
      )}

      <Button
        icon
        floated='right'
        labelPosition='left'
        color={'blue'}
        onClick={async () => {
          await generateCode();
          setShowQr(true);
        }}
        loading={isLoading}
      >
        <Icon name='qrcode' />
        QR-Code
      </Button>

      <Segment vertical className='u-clear-both'>
        Das eingeladene Gerät wird mit diesem Gruppenmitglied verknüpft. Ein Gerät kann nur mit einem Mitglied einer
        Gruppe verknüpft sein, aber mit mehreren Mitgliedern verschiedener Gruppen.
      </Segment>

      {showQr && (
        <Modal
          className='scanInvitation-modal'
          open={true}
          dimmer={'inverted'}
          onClose={() => setShowQr(false)}
          basic
          size='small'
        >
          <Modal.Content>
            <div className='qrCodeContainer'>
              {!showQrSuccess && <QRCodeCanvas value={invitationUrl} size={Math.min(window.innerWidth - 64, 680)} />}
              {showQrSuccess && <Icon name={'check circle'} color={'green'} size={'massive'} />}
            </div>
          </Modal.Content>
        </Modal>
      )}
    </section>
  );
}
