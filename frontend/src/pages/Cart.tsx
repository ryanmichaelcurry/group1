import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  useMantineTheme,
  NumberInput, NumberInputHandlers,
  createStyles,
  rem,
  Container,
  TextInput,
  Button,
  Modal,
} from '@mantine/core';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { IconPlus, IconMinus } from '@tabler/icons-react';

//import { redirect } from 'next/navigation';
import { useRouter } from 'next/router'

//import Cookies from 'js-cookie';

import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext'; // we need this import to use the state variable
import { StoreContext } from '../context/StoreContext';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${rem(6)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]
      }`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,

    '&:focus-within': {
      borderColor: theme.colors[theme.primaryColor][6],
    },
  },

  control: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]
      }`,

    '&:disabled': {
      borderColor: theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3],
      opacity: 0.8,
      backgroundColor: 'transparent',
    },
  },

  input: {
    textAlign: 'center',
    paddingRight: `${theme.spacing.sm} !important`,
    paddingLeft: `${theme.spacing.sm} !important`,
    height: rem(28),
    flex: 1,
  },
}));


import { IconPencil, IconTrash } from '@tabler/icons-react';

export default function CartPage() {

  const router = useRouter();

  const { state } = useContext(AuthContext);
  const { cartItems, cartTotal, setCartItems, removeItemFromCart } = useContext(StoreContext);
  const { send } = useContext(ApiContext);

  const { classes } = useStyles();
  const handlers = useRef<NumberInputHandlers>(null);
  const [value, setValue] = useState<number | ''>(1);

  const [showCheckoutModal, setshowCheckoutModal] = useState(false);

  const [userData, setUserData] = useState({
    address: '',
    creditCardNumber: '',
    CVV: '',
    name: ''
  });

  const handleUpload = async () => {
    const response = await send("POST:/checkout", userData);
    console.log(response);
    if (response.status) {
      setshowCheckoutModal(false);
      setUserData({
        address: '',
        creditCardNumber: '',
        CVV: '',
        name: ''
      });
      setCartItems([]);
    }
  };


  const theme = useMantineTheme();

  const rows = cartItems.map((item: any) => (
    <tr key={item.name}>
      <td>
        <Text fz="sm" fw={500}>
          {item.title}
        </Text>
      </td>

      <td>
        <Text fz="sm" fw={500}>
          {item.price}
        </Text>
      </td>

      <td>
        <Text fz="sm" fw={500}>
          {item.quantity}
        </Text>
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon color="red" onClick={() => removeItemFromCart(item.inventory_id)}>
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Container
      size="lg"
      px="md
    "
    >    <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <h2>
          Total: {cartTotal}
        </h2>
        <Button variant="outline" onClick={() => setshowCheckoutModal(true)} style={{ marginTop: 32 }}>
          Checkout Cart
        </Button>

        <Modal
          title="Checkout"
          opened={showCheckoutModal}
          onClose={() => setshowCheckoutModal(false)}
          padding="sm"
        >
          <TextInput
            label="Address"
            placeholder="308 Negra Arroyo Lane"
            value={userData.address}
            onChange={(event) => setUserData({ ...userData, address: event.target.value })}
            required
          />

          <TextInput
            label="Card Holder Name"
            placeholder="Walter White"
            value={userData.name}
            onChange={(event) => setUserData({ ...userData, name: event.target.value })}
            required
          />

          <TextInput
            label="Credit Card Number"
            placeholder="3026 1839 1935 7157"
            type="number"
            min={0}
            value={userData.creditCardNumber}
            onChange={(event) => setUserData({ ...userData, creditCardNumber: event.target.value })}
            required
          />

          <TextInput
            label="CVV"
            placeholder="123"
            type="number"
            min={0}
            value={userData.CVV}
            onChange={(event) => setUserData({ ...userData, CVV: event.target.value })}
            required
          />


          <Button variant="outline" onClick={handleUpload} style={{ marginTop: 16 }}>
            Checkout
          </Button>
        </Modal>
      </ScrollArea>
    </Container>
  );
}

