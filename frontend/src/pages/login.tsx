import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Container,
} from '@mantine/core';
import React, { useEffect, useState, useContext } from 'react';

//import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';

//import Cookies from 'js-cookie';

import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';

export function AuthenticationForm() {
  const router = useRouter();

  const { signIn, signUp, state } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [terms, setTerms] = useState(false);

  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      dateOfBirth: '2000 09 12',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  if (state.userToken != null) {
    router.push('/home'); // redirect to home page
  }

  return (
    <Container
      size="lg"
      px="md
    "
    >
      <Text size="lg" weight={500} style={{ marginTop: 64 }}>
        Welcome to Legal Paperweights!
      </Text>

      <Divider label="Login or Register Below" labelPosition="center" my="lg" />

      <Stack>
        {type === 'register' && (
          <TextInput
            required
            label="First Name"
            placeholder="John"
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
            radius="md"
          />
        )}

        {type === 'register' && (
          <TextInput
            required
            label="Last Name"
            placeholder="Smith"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
            radius="md"
          />
        )}

        <TextInput
          required
          label="Email"
          placeholder="totallyLegal@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          error={form.errors.email && 'Invalid email'}
          radius="md"
        />
        {type === 'register' && (
          <DatePickerInput
            required
            mt="md"
            popoverProps={{ withinPortal: true }}
            label="Date of Birth"
            placeholder="YYYY MMM DD"
            valueFormat="YYYY MMM DD"
            defaultDate={new Date(2000, 1)}
            onChange={setDateOfBirth}
          />
        )}

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          error={form.errors.password && 'Password should include at least 6 characters'}
          radius="md"
        />

        {type === 'register' && (
          <Checkbox
            label="I accept terms and conditions"
            checked={terms}
            onChange={(event) => setTerms(event.currentTarget.checked)}
          />
        )}
      </Stack>

      <Group position="apart" mt="xl">
        <Anchor component="button" type="button" color="dimmed" onClick={() => toggle()} size="xs">
          {type === 'register'
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </Anchor>

        <Button
          type="submit"
          radius="xl"
          onClick={() => {
            if (type == 'login') {
              signIn({ email, password });
            } else {
              signUp({ email, password, firstName, lastName, terms, dateOfBirth });
            }
          }}
        >
          {upperFirst(type)}
        </Button>
      </Group>
    </Container>
  );
}

export default AuthenticationForm;
