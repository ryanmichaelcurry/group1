import { Container, Menu, Center, RemoveScroll, Group, Button, Indicator } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { ColorSchemeControl } from '@mantine/ds';
import Link from 'next/link';
import useStyles from './Header.styles';
import logo from '../../../data/images/logo-no-background.png';
import { ShoppingCart, User } from 'tabler-icons-react';
import { IconSearch, IconSettings, IconDoorExit } from '@tabler/icons-react';

import { AuthContext } from '../../../context/AuthContext';
import { StoreContext } from '../../../context/StoreContext';

interface HeaderProps {
  toggleDir(): void;
  dir: 'rtl' | 'ltr';
}

export function Header({ toggleDir, dir }: HeaderProps) {
    const { state, signOut } = useContext(AuthContext);

    const { classes, cx } = useStyles();
    var { cart } = useContext(StoreContext);
    console.log("cart from header: ", cart);

  // router is used to determine what the pathname is.
  const router = useRouter();

  return (
    <div className={cx(classes.header, RemoveScroll.classNames.zeroRight)}>
      <Container size="xl" px="md" className={classes.inner}>
        <Center component="a" href="/" sx={(theme) => theme.fn.focusStyles()}>
          <Link href="/">
            <Image src={logo} className="logo" alt="Logo" height={35} width={230} />
          </Link>
        </Center>
              <Button onClick= {() => console.log(cart)}> DEBUG: Cart</Button>
        {/* if pathname is login, dont show cart of profile*/}
        {router.pathname !== '/login' ? (
          <Group position="right">
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button leftIcon={<User />} variant="white"></Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Link href="/Profile">
                  <Menu.Item icon={<IconSettings size={14} />}>View Profile</Menu.Item>
                </Link>

                <Menu.Item color="red" onClick={()=> {signOut()}} icon={<IconDoorExit size={14} />}>
                  Log Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

                      <Link href="/Cart" passHref>
                          
                          <Button leftIcon={
                              <Indicator label={cart[0].cart_num_items} disabled={cart[0].cart_num_items == 0} color="red" size={16}>
                                  <ShoppingCart />
                              </Indicator>
                          } variant="white"></Button>
                              
            </Link>
          </Group>
        ) : (
          <></>
        )}

        <Center sx={(theme) => ({ [theme.fn.largerThan('sm')]: { display: 'none' } })}>
          <ColorSchemeControl />
        </Center>
      </Container>
    </div>
  );
}
