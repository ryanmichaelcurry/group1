import { Container, Menu, Center, RemoveScroll, Group, Button } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, from 'react';
import { ColorSchemeControl } from '@mantine/ds';
import Link from 'next/link';
import useStyles from './Header.styles';
import logo from '../../../data/images/logo-no-background.png';
import { ShoppingCart, User } from 'tabler-icons-react';
import { IconSearch, IconSettings, IconDoorExit } from '@tabler/icons-react';
import { ApiContext } from '../../../context/ApiContext';
import { AuthContext } from '../../../context/AuthContext';




interface HeaderProps {
    toggleDir(): void;
    dir: 'rtl' | 'ltr';
}

export function Header({ toggleDir, dir }: HeaderProps) {
    const { classes, cx } = useStyles();


    // router is used to determine what the pathname is.
    const router = useRouter();

    // gets current user session info. If not logged in, redirect to login
    
    if (typeof window !== 'undefined') {

        

      : '{"user_id": 0, "first": "null", "last": "null", "status": "buyer"}';
        

    }

    
    
  
    function logOut() {
        // when user clicks log out
        // log their account out and redirect to login screen

        sessionStorage.setItem('loggedInUser', JSON.stringify('{"user_id": 0, "first": "null", "last": "null", "status": "buyer"}'));
        
        router.push('/login');

    }

    
    

    

    return (
        
            

                

                <div className={cx(classes.header, RemoveScroll.classNames.zeroRight)}>

            <Container size="xl" px="md" className={classes.inner}>
                <Center component="a" href="/" sx={(theme) => theme.fn.focusStyles()}>
                    <Link href="/">
                        <Image src={logo} className="logo" alt="Logo" height={35} width={230} />
                    </Link>
                </Center>

                

                {/* if pathname is login, dont show cart of profile*/}
                {router.pathname !== "/login" ? <Group position="right">
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Button leftIcon={<User />} variant="white">

                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Link href="/Profile">
                                <Menu.Item icon={<IconSettings size={14} />}>View Profile</Menu.Item>
                            </Link>
                            
                            
                            <Menu.Item color="red" onClick={logOut} icon={<IconDoorExit size={14} />}>Log Out</Menu.Item>
                           
                            
                        </Menu.Dropdown>
                    </Menu>

                    <Link href="/Cart" passHref>
                        <Button leftIcon={<ShoppingCart />} variant="white"></Button>
                    </Link>
                </Group> : <></>}

                <Center sx={(theme) => ({ [theme.fn.largerThan('sm')]: { display: 'none' } })}>
                    <ColorSchemeControl />
                </Center>
            </Container>
        </div>
            
            
        


        
    );
}
