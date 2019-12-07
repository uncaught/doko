import {useContext, useMemo} from 'react';
import {firebaseContext} from 'src/components/Firebase/Firebase';

export function useUsers() {
  const {db} = useContext(firebaseContext);
  return useMemo(() => ({
    getUsers: () => db.ref(`users`),
    getUser: (uid: string) => db.ref(`users/${uid}`),
  }), [db]);
}
