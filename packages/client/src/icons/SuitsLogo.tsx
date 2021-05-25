import React from 'react';
import {ReactComponent as SuitClubs} from './SuitClubs.svg';
import {ReactComponent as SuitDiamonds} from './SuitDiamonds.svg';
import {ReactComponent as SuitHearts} from './SuitHearts.svg';
import {ReactComponent as SuitSpades} from './SuitSpades.svg';
import './SuitsLogo.css';

export default function SuitsLogo(): React.ReactElement {
  return <div className="SuitsLogo">
    <SuitClubs />
    <SuitHearts />
    <SuitSpades />
    <SuitDiamonds />
  </div>;
}
