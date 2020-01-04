import React, {ReactElement} from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {useActivePlayers} from '../../store/Players';

export default function Round(): ReactElement {
  const {url} = useRouteMatch();
  const players = useActivePlayers();
  return <section>
    <Link to={`${url}/players`}>Mitspieler ({players.length})</Link>
  </section>;
}
