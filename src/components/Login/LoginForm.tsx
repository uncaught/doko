import React, {FormEvent, useContext, useState} from 'react';
import {Button, Form, Grid, Message, Segment} from 'semantic-ui-react';
import {firebaseContext} from 'src/components/Firebase/Firebase';
import {useHistory} from "react-router";
import {HOME, SIGN_UP} from 'src/constants/routes';
import {Link} from 'react-router-dom';
import {useUsers} from 'src/components/Firebase/Users';

export default function LoginForm({isSignUp}: { isSignUp?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {auth} = useContext(firebaseContext);
  const {getUser} = useUsers();
  const action = isSignUp ? auth.createUserWithEmailAndPassword.bind(auth) : auth.signInWithEmailAndPassword.bind(auth);

  const history = useHistory();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (loading) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    setLoading(true);
    try {
      const authUser = await action(email, password);
      if (isSignUp) {
        await getUser(authUser.user?.uid).set({email});
      }
      form.reset();
      history.push(HOME);
    } catch (e) {
      setError(e.message || e);
    } finally {
      setLoading(false);
    }
  };

  return <Grid textAlign='center' verticalAlign='middle'>
    <Grid.Column style={{maxWidth: 450}}>
      <Segment>
        <Form size='large' onSubmit={onSubmit}>
          <Form.Input
            fluid
            required
            name='email'
            autoComplete='username'
            icon='user'
            iconPosition='left'
            placeholder='E-Mail-Adresse'
          />
          <Form.Input
            fluid
            required
            name='password'
            autoComplete={isSignUp ? 'new-password' : 'password'}
            icon='lock'
            iconPosition='left'
            placeholder='Passwort'
            type='password'
          />
          <Button loading={loading} color='teal' fluid size='large'>{isSignUp ? 'Registrieren' : 'Anmelden'}</Button>
        </Form>
        {!!error && <Message negative>{error}</Message>}
        {!isSignUp && <Message size={'tiny'}>oder <Link to={SIGN_UP}>registrieren</Link></Message>}
      </Segment>
    </Grid.Column>
  </Grid>;
}
