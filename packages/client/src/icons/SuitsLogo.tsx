import React from 'react';
import SuitClubs from './SuitClubs.svg';
import SuitDiamonds from './SuitDiamonds.svg';
import SuitHearts from './SuitHearts.svg';
import SuitSpades from './SuitSpades.svg';
import './SuitsLogo.css';

export default function SuitsLogo(): React.ReactElement {
  return <div className='SuitsLogo'>
    <SuitClubs/>
    <SuitHearts/>
    <SuitSpades/>
    <SuitDiamonds/>
  </div>;
}
