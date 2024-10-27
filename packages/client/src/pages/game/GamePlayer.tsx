import {GroupMember} from '@doko/common';
import React, {ReactElement, useState} from 'react';
import {useDrag} from 'react-dnd';
import {Header, Icon, Label, Modal} from 'semantic-ui-react';
import GamePlayerSideModal from './GamePlayerSideModal';

export default function GamePlayer({member}: {member: GroupMember}): ReactElement {
  const [open, setOpen] = useState(false);
  const [, dragRef] = useDrag({item: {memberId: member.id}, type: 'gamePlayer'});
  return (
    <div className='memberDetail' ref={dragRef}>
      <Label onClick={() => setOpen(true)}>
        {member.name} <Icon name={'user'} />
      </Label>
      <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
        <Header>Partei von {member.name}</Header>
        <GamePlayerSideModal member={member} close={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
