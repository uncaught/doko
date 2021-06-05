import React, {useEffect, useState} from 'react';
import {useAcceptInvitation} from '../store/GroupMembers';
import {Message} from 'semantic-ui-react';

export default function HandleInvitation(): React.ReactElement {
  const [failed, setFailed] = useState(false);
  const acceptInvitation = useAcceptInvitation();
  useEffect(() => {
    let disposed = false;
    acceptInvitation(window.location.href).then((success) => {
      if (!disposed && !success) {
        setFailed(true);
      }
    });
    return () => {
      disposed = true;
    };
  }, [acceptInvitation]);
  return <div className="u-relative">
    {!failed && <div className="ui active inverted dimmer">
      <div className="ui text loader"/>
    </div>}
    {failed && <Message negative>Der Einladungs-Code ist nicht mehr gültig</Message>}
  </div>;
}
