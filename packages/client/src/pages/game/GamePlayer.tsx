import {GroupMember} from '@doko/common';
import React, {ReactElement, useState} from 'react';
import {Header, Icon, Label, Modal} from 'semantic-ui-react';
import GamePlayerSideModal from './GamePlayerSideModal';
import {useDrag} from 'react-dnd';

export default function GamePlayer({member}: { member: GroupMember }): ReactElement {
  const [open, setOpen] = useState(false);
  const [, dragRef] = useDrag({item: {type: 'gamePlayer', memberId: member.id}});
  return <div ref={dragRef} className="memberDetail">
    <Label onClick={() => setOpen(true)}>
      {member.name} <Icon name={'user'}/>
    </Label>
    <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
      <Header>Partei von {member.name}</Header>
      <GamePlayerSideModal member={member} close={() => setOpen(false)}/>
    </Modal>
  </div>;
}
