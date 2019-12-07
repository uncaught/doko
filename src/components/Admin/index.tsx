import React, {useEffect, useState} from 'react';
import {useUsers} from 'src/components/Firebase/Users';
import firebase from 'firebase';

interface User {
  uid: string;
  email: string;
}

export default function Admin() {
  const {getUsers} = useUsers();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    return getUsers().on('value', (snapshot: firebase.database.DataSnapshot | null) => {
      if (snapshot) {
        setUsers(Object.entries(snapshot.val() as object).map<User>(([uid, data]) => ({...data, uid})));
      }
    });
  }, [getUsers]);

  return <div>
    {users.map((user) => <div key={user.uid}>{user.email}</div>)}
  </div>;
}
