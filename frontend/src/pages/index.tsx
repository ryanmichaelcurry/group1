import Head from 'next/head';
import {
  NumberInput,
  Autocomplete,
  Container,
  Grid,
  useMantineTheme,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Filter } from 'tabler-icons-react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, Component } from 'react';
import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';
import { StoreContext } from '../context/StoreContext';

interface HomePageProps {
  componentsCountByCategory: Record<string, number>;
}

export default function HomePage() {
    // gets current user session info. If not logged in, redirect to login
    const { state } = useContext(AuthContext);
    const { inventory } = useContext(StoreContext);

    // this is used for product search filtering
    const [products, setProducts] = useState({
        query: '',
        list: inventory,
    });
    const handleChange = (e) => {
        const results = inventory.filter((thisData) => {
            if (e === '') return inventory;
            return (
                thisData.title.toLowerCase().includes(e.toLowerCase()) ||
                thisData.description.toLowerCase().includes(e.toLowerCase())
            );
        });
        setProducts({
            query: e,
            list: results,
        });
    };

    useEffect(() => {
        setProducts({ query: products.query, list: inventory });
    }, [inventory]);

    const { cartItems, addItemToCart, removeItemFromCart } = useContext(StoreContext);

    const qtyRef = useRef<number[]>([]);

    const arrTemp = new Array(inventory.length);
    arrTemp.fill(1, 0);
    qtyRef.current = arrTemp;

  const theme = useMantineTheme();

 


  

  return (
    <>
      <div>
        <Head>
          <title>LegalPaperweights</title>
        </Head>

        <div id="main">
          <Container my="sm">
            <h2>
              Welcome back, {state.user.firstName} {state.user.lastName}
            </h2>
            <Autocomplete
              placeholder="Search the Store"
              icon={<IconSearch size="1rem" stroke={1.5} />}
              data={['pARperweight-15', 'Big N Heavy', 'Big and Blue']}
              onChange={handleChange}
              value={state.query}
            />

            <hr />

            <Grid grow>
              {products.list.map((ProductData: any, i: number) => {
                return (
                  <Grid.Col span={4}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Image src={ProductData.image_url} fit="contain" alt={ProductData.title} />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>{ProductData.title}</Text>
                        <Group position="right">
                          <Badge color="pink" variant="light">
                            QTY: {ProductData.quantity}
                          </Badge>
                          <Badge color="pink" variant="light">
                            ${ProductData.price}
                          </Badge>
                        </Group>
                      </Group>

                      <Text size="sm" color="dimmed">
                        {ProductData.description}
                      </Text>

                      <Group spacing="xs" noWrap={true}>
                        <NumberInput
                                    id="ref"
                                    defaultValue={1}
                                    min={1}

                                    max={ProductData.quantity}
                                    placeholder="QTY"
                                    label="Amount"
                                    //withAsterisk
                                    ref={el => qtyRef.current[i] = el}
                        />
                        <Button
                          onClick={()=>addItemToCart(ProductData.inventory_id, Number(qtyRef.current[i].value) )}  // replace 1 with qty selected
                          variant="light"
                          color="blue"
                          fullWidth
                          mt="md"
                          radius="md"
                        >
                          Add to Cart
                        </Button>
                      </Group>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Container>
        </div>
      </div>
    </>
  );
}
