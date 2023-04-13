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
  Container
} from '@mantine/core';
import React, { useEffect, useState, useContext } from 'react';

//import { redirect } from 'next/navigation';
import { useRouter } from 'next/router'

//import Cookies from 'js-cookie';

import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext'; // we need this import to use the state variable

export function Home() {
  const router = useRouter();

  const { state } = useContext(AuthContext);  // we need this to get the state variable to our function
  
  console.log(state.user); // DEBUG

  /*
   state.user = {email, firstName, lastName, dateOfBirth}
   so, state.user.email will return "test@test.com" (or whatever your email is)
  */
  
  if(state.user != null) {

    return (
      <Container size="lg" px="md
      ">
        <Text size="lg" weight={500} style={{marginTop: 64}}>
          {state.user.email}
        </Text>
      </Container>
    );

  }
}

export default Home;
