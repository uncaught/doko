import React, {ReactElement, useEffect, useState} from 'react';
import {useGame, useGamePlayers, usePatchGame} from '../../store/Games';
import {Divider, Form, Header, Icon, Label, Modal, Radio, SemanticICONS} from 'semantic-ui-react';
import {ExtraPoint, GroupSettings} from '@doko/common';
import {useGroup} from '../../store/Groups';

const types = new Map<keyof GroupSettings['extraPoints'], { label: string; hasFrom?: true, icon: SemanticICONS }>([
  ['doppelkopf', {label: 'Doppelkopf', icon: 'diamond'}],
  ['foxCaught', {label: 'Fuchs gefangen', hasFrom: true, icon: 'firefox'}],
  ['karlGotLastTrick', {label: 'Karlchen macht letzten Stich', icon: 'spy'}],
  ['karlCaught', {label: 'Karlchen gefangen', hasFrom: true, icon: 'shipping'}],
]);

export default function ExtraPointEntry({isRe, index}: { isRe: boolean; index: number }): ReactElement {
  const {data} = useGame()!;
  const {settings} = useGroup()!;
  const [open, setOpen] = useState(false);
  const patchGame = usePatchGame();
  const gamePlayers = useGamePlayers()!;

  const sideKey = isRe ? 're' : 'contra';
  const otherSideKey = isRe ? 'contra' : 're';
  const extraPoints = data[sideKey].extraPoints;

  const [point, setPoint] = useState<Partial<ExtraPoint>>(() => ({...(extraPoints[index] || {})}));
  useEffect(() => setPoint({...(extraPoints[index] || {})}), [extraPoints, index]);

  const save = (partial: Partial<ExtraPoint>) => {
    const newPoint = {...point, ...partial} as ExtraPoint;

    if (newPoint.type && newPoint.to) {
      const shouldHaveFrom = types.get(newPoint.type)!.hasFrom;
      if (!shouldHaveFrom) {
        delete newPoint.from;
      }
      if (!shouldHaveFrom || newPoint.from) {
        const newPoints = [...extraPoints];
        if (index === -1) {
          newPoints.push(newPoint);
        } else {
          newPoints[index] = newPoint;
        }
        patchGame({data: {[sideKey]: {extraPoints: newPoints}}});
        setOpen(false);
      }
    }

    setPoint(newPoint);
  };

  return <div className="memberDetail">
    {index === -1 && <>
      <Label className={'iconOnly'} color={'green'} onClick={() => setOpen(true)}>
        <Icon name={'plus'}/>
      </Label>
    </>}

    {index > -1 && <>
      <Label className={'iconOnly'} color={'blue'} onClick={() => setOpen(true)}>
        <Icon name={types.get(point.type!)!.icon}/>
      </Label>
    </>}


    <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
      <Header>Sonderpunkt für {isRe ? 'Re' : 'Contra'}</Header>
      <Modal.Content>
        <Form>
          {[...types].filter(([value]) => settings.extraPoints[value])
                     .map(([value, {label, icon}]) => <Form.Field key={value}>
                       <Radio
                         label={<label className="inverted"><Icon name={icon}/> {label}</label>}
                         name='extraPointType'
                         value={value}
                         checked={point.type === value}
                         onChange={() => save({type: value})}
                       />
                     </Form.Field>)}

          <Divider inverted/>

          <Form.Field>
            Punkt für
          </Form.Field>
          {gamePlayers[sideKey].map(({member}) => <Form.Field key={member.id}>
            <Radio
              label={<label className="inverted">{member.name}</label>}
              name='to'
              value={member.id}
              checked={point.to === member.id}
              onChange={() => save({to: member.id})}
            />
          </Form.Field>)}

          <div className={!!point.type && types.get(point.type)!.hasFrom ? '' : 'u-visibility-hidden'}>
            <Divider inverted/>
            <Form.Field>
              Gefangen von
            </Form.Field>
            {gamePlayers[otherSideKey].map(({member}) => <Form.Field key={member.id}>
              <Radio
                label={<label className="inverted">{member.name}</label>}
                name='from'
                value={member.id}
                checked={point.from === member.id}
                onChange={() => save({from: member.id})}
              />
            </Form.Field>)}
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  </div>;
}
