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
import { useState } from 'react';
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
    const results = ProductData.filter((thisData) => {
      if (e === '') return ProductData;
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
    setProducts({query: products.query, list: inventory});
  }, [inventory]);
  

  const theme = useMantineTheme();

  if (typeof state.user.firstName === "undefined") {
    return;
  }


  // below is the product data we pull in. Sample data is there right now
  var ProductData = [
    {
      inventory_id: 12345,
      title: 'Vibrant Blue Flowers',
      quantity: 12,
      created_at: '4/3/2023',
      description: 'Great, like new',
      image_url:
        'https://images.unsplash.com/photo-1677678071434-94dc161771f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2291&q=80',
      price: 12.95,
    },
    {
      inventory_id: 54321,
      title: 'Small Viking',
      quantity: 9,
      created_at: '4/1/2023',
      description: 'Keeps paper down and pillagers away.',
      image_url:
        'https://images.unsplash.com/photo-1532714973334-71d839b1ebea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      price: 32.99,
    },
    {
      inventory_id: 23234,
      title: 'Ski Slopes with Mountain',
      quantity: 3,
      created_at: '4/1/2023',
      description: 'Think about your next skiing vacation while at work with this paperweight.',
      image_url: 'https://www.montblanc.com/variants/images/1647597300408861/A/w2500.jpg',
      price: 15.99,
    },
    {
      inventory_id: 34141,
      title: 'Hand-Painted Tian Bird on Branch',
      quantity: 5,
      created_at: '4/5/2023',
      description: 'Add a touch of nature to your workplace.',
      image_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWT0nT0Waxbv9pLDUltOj2FaoHCVqqV4lQvZFtk6A-tE5-x31Re_N0EQck9GwqoObWyRU&usqp=CAU',
      price: 22.0,
    },
    {
      inventory_id: 23255,
      title: 'Solar System 3D',
      quantity: 14,
      created_at: '4/5/2023',
      description: 'No need to look up at the stars anymore, stay inside and keep working.',
      image_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_DPp9vYqBV0uUITcNMM-YrOFPUyjUzGZUExXJiphHvT0iEmXXi74T7Dd7brSJyE1S1MU&usqp=CAU',
      price: 21.0,
    },
  ];

  function addToCart(invId: number, qty: number) {
    // this function is called when user clicks add to cart
    // this should add this item to their cart of given qty, and subtract that from available product
      let updatedVal = {};
      updatedVal = {"cart_num_items": cart[0].cart_num_items = cart[0].cart_num_items + qty };
      setCart(cart => ({
          ...cart,
          ...updatedVal
      }))
      
    console.log(cart);
  }

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
              {products.list.map((ProductData: any) => {
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
                          withAsterisk
                        />
                        <Button
                          onClick={()=>addToCart(ProductData.inventory_id, 1 )}  // replace 1 with qty selected
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
