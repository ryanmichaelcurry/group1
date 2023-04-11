import Head from 'next/head';
import { NumberInput, Autocomplete, Container, Grid, useMantineTheme, Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Filter } from 'tabler-icons-react';
import { useState } from "react";
import { useRouter } from 'next/router';
import React, { useContext, useEffect, Component } from 'react';
import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';



interface HomePageProps {
    componentsCountByCategory: Record<string, number>;
}



export function HomePage() {

    // gets current user session info. If not logged in, redirect to login
    const { sstate } = useContext(AuthContext);  

    const theme = useMantineTheme();

    // below is the product data we pull in. Sample data is there right now
    var ProductData = [
        {
            item_id: 12345,
            title: "Vibrant Blue Flowers",
            inventory_id: "98765ABC",
            quantity: 12,
            created_at: "4/3/2023",
            description: "Great, like new",
            image_url: "https://images.unsplash.com/photo-1677678071434-94dc161771f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2291&q=80",
            price: 12.95
        },
        {
            item_id: 54321,
            title: "Small Viking",
            inventory_id: "98765XYZ",
            quantity: 9,
            created_at: "4/1/2023",
            description: "Keeps paper down and pillagers away.",
            image_url: "https://images.unsplash.com/photo-1532714973334-71d839b1ebea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            price: 32.99
        },
        {
            item_id: 23234,
            title: "Ski Slopes with Mountain",
            inventory_id: "989832HSD",
            quantity: 3,
            created_at: "4/1/2023",
            description: "Think about your next skiing vacation while at work with this paperweight.",
            image_url: "https://www.montblanc.com/variants/images/1647597300408861/A/w2500.jpg",
            price: 15.99
        },
        {
            item_id: 34141,
            title: "Hand-Painted Tian Bird on Branch",
            inventory_id: "989832HSD",
            quantity: 5,
            created_at: "4/5/2023",
            description: "Add a touch of nature to your workplace.",
            image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWT0nT0Waxbv9pLDUltOj2FaoHCVqqV4lQvZFtk6A-tE5-x31Re_N0EQck9GwqoObWyRU&usqp=CAU",
            price: 22.00
        },
        {
            item_id: 23255,
            title: "Solar System 3D",
            inventory_id: "2380489JLDF",
            quantity: 14,
            created_at: "4/5/2023",
            description: "No need to look up at the stars anymore, stay inside and keep working.",
            image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_DPp9vYqBV0uUITcNMM-YrOFPUyjUzGZUExXJiphHvT0iEmXXi74T7Dd7brSJyE1S1MU&usqp=CAU",
            price: 21.00
        }
    ]

    function addToCart() {
        // this function is called when user clicks add to cart
        // this should add this item to their cart of given qty, and subtract that from available product
        console.log();

    }


    // this is used for product search filtering
    const [state, setstate] = useState({
        query: '',
        list: ProductData

    })
    const handleChange = (e) => {

        const results = ProductData.filter(thisData => {

            if (e === "") return ProductData
            return thisData.title.toLowerCase().includes(e.toLowerCase()) || thisData.description.toLowerCase().includes(e.toLowerCase())
        })
        setstate({
            query: e,
            list: results
        })

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
                            Welcome back, {sstate.user.first} {sstate.user.last}
                        </h2>
                        <Autocomplete
                            placeholder="Search the Store"
                            icon={<IconSearch size="1rem" stroke={1.5} />}
                            data={['pARperweight-15', 'Big N Heavy', 'Big and Blue',]}
                            onChange={handleChange}
                            value={state.query}
                        />

                        <hr />

                        <Grid grow>
                            {(state.list.map(ProductData => {


                                return <Grid.Col span={4}>
                                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                                        <Card.Section>
                                            <Image
                                                src={ProductData.image_url}

                                                fit="contain"
                                                alt={ProductData.title}
                                            />
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
                                            <Button onClick={addToCart} variant="light" color="blue" fullWidth mt="md" radius="md">
                                                Add to Cart
                                            </Button>
                                        </Group>
                                    </Card>
                                </Grid.Col>

                            }))}
                        </Grid>


                    </Container>

                </div>
            </div>

        </>
    );
}
