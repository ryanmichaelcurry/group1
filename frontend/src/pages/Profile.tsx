import { Text, Container, Button, Modal, TextInput, Table, Group, ActionIcon, Space, Title, Select, Image, Checkbox, Switch } from '@mantine/core';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StoreContext } from '../context/StoreContext';
import { ApiContext } from '../context/ApiContext';


import {  CircleOff, Trash } from 'tabler-icons-react';

export function ProfilePage() {
    const { state } = useContext(AuthContext);
    const { setInventory } = useContext(StoreContext);
    const { send } = useContext(ApiContext);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [itemData, setItemData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        image_url: '',
    });
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [listings, setListings] = useState([]);
    const [whichTable, setWhichTable] = useState(0);
    
    

    useEffect(() => {
        send("GET:/transactions").then((res: any) => { setTransactions(res.transactions); console.log("profile", res) });
        send("GET:/users").then((res: any) => { setUsers(res); console.log("users", res) }).catch(() => 0);
        send("GET:/listings").then((res: any) => { setListings(res.listings); console.log("listings", res) }).catch(() => 0);
    }, []);

    const handleUpload = async () => {
        const response = await send("POST:/inventory", itemData);
        console.log(response);
        if (response.status) {
            setShowUploadModal(false);
            setItemData({
                title: '',
                description: '',
                price: '',
                quantity: '',
                image_url: '',
            });
            send("GET:/inventory").then((res: any) => setInventory(res.inventory));
        }
    };

    function handleTypeChange(account_guid: string, status: number) {
        const data = status == -1 ? { account_guid: account_guid } : { account_guid: account_guid, type: status };
        console.log(data);
        send("PUT:/users", data).then((res: any) => { console.log(res) });
    };

    function approveItem(inventory_id: number) {
        const data = { inventory_id: inventory_id};
        send("PUT:/listings", data).then((res: any) => { console.log(res) });
    };
    function removeItem(inventory_id: number) {
        const data = { inventory_id: inventory_id};
        send("DELETE:/inventory", data).then((res: any) => { console.log("res:", res) });
        const newListingArray = listings.filter((listing: any) => listing.inventory_id !== inventory_id);

        setListings(newListingArray);
    };

    console.log("transactions: ", transactions);
    const rows = transactions.map((item: any) => (
        <tr key={item.cart_id}>
            <td>
                <Text fz="sm" fw={500}>
                    {item.cart_id}
                </Text>
            </td>

            <td>
                <Text fz="sm" fw={500}>
                    {item.total}
                </Text>
            </td>

        </tr>
    ));
    console.log('inventory:',listings);
    const newItems = listings.map((product: any) => (
        <tr key={product.cart_id}>
            <td>
                <Text fz="sm" fw={500}>
                    {product.inventory_id}
                </Text>
            </td>
            <td>
                <Text fz="sm" fw={500}>
                    {product.title}
                </Text>
            </td>

            <td>
                <Text fz="sm" fw={500}>
                    {product.price}
                </Text>
            </td>
            <td>
                <Text fz="sm" fw={500}>
                    {product.quantity}
                </Text>
            </td>
            <td>
                
                <Image
                    radius="md"
                    src={product.image_url}
                    fit="contain"
                    height={80 }
                />
                    
                
            </td>
            <td>
                <Checkbox disabled={product.status}
                    onChange={() => {
                        approveItem(product.inventory_id);

                    }}
                />
                
            </td>
            <td>
                
                <ActionIcon color="red" onClick={() => {
                    removeItem(product.inventory_id);
                }}>
                    <Trash size="1rem"  />
                </ActionIcon>
                
            </td>

        </tr>
    ));

    if (state.user.type == 1) { // seller
        return (
            <Container size="lg" px="md">
                <Text size="lg" weight={500} style={{ marginTop: 64 }}>
                    Welcome to your profile, {state.user.firstName}!
                </Text>

                <br></br>

                <Text>
                    Email address: {state.user.email}
                </Text>

                <Text>
                    Earnings: {state.user.earnings}
                </Text>

                <Button variant="outline" onClick={() => setShowUploadModal(true)} style={{ marginTop: 32 }}>
                    Upload Item
                </Button>

                <Modal
                    title="Upload Item"
                    opened={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    padding="sm"
                >
                    <TextInput
                        label="Title"
                        placeholder="Enter item title"
                        value={itemData.title}
                        onChange={(event) => setItemData({ ...itemData, title: event.target.value })}
                        required
                    />

                    <TextInput
                        label="Description"
                        placeholder="Enter item description"
                        value={itemData.description}
                        onChange={(event) => setItemData({ ...itemData, description: event.target.value })}
                        required
                    />

                    <TextInput
                        label="Price"
                        placeholder="Enter item price"
                        type="number"
                        min={0}
                        value={itemData.price}
                        onChange={(event) => setItemData({ ...itemData, price: event.target.value })}
                        required
                    />

                    <TextInput
                        label="Quantity"
                        placeholder="Enter the amount of items"
                        type="number"
                        min={0}
                        value={itemData.quantity}
                        onChange={(event) => setItemData({ ...itemData, quantity: event.target.value })}
                        required
                    />

                    <TextInput
                        label="URL"
                        placeholder="Enter URL"
                        value={itemData.image_url}
                        onChange={(event) => setItemData({ ...itemData, image_url: event.target.value })}
                        type="url"
                        required
                    />


                    <Button variant="outline" onClick={handleUpload} style={{ marginTop: 16 }}>
                        Upload
                    </Button>
                </Modal>
            </Container>
        );
    }

    if (state.user.type == 2) {  // admin

        const usersRow = users.map((user: any) => (
            <tr key={user.account_guid}>
                <td>
                    <Text fz="sm" fw={500}>
                        {user.email}
                    </Text>
                </td>
    
                
                <td>
                    <Select defaultValue={user.type.toString()} data={[
                        {value: '-1', label: 'Deactivated'},
                        {value: '0', label: 'Buyer'},
                        { value: '1', label: 'Seller' },
                        { value: '2', label: 'Admin' },
                    ]}
                        onChange={(value) => {
                            console.log(user);  // handle changing user types here
                            console.log(value);
                            handleTypeChange(user.account_guid, Number(value)  )
                        }}
                    >
                    </Select>
                </td>
                
            </tr>
        ));

        return (
            <Container size="lg" px="md">

                <Space h="lg" />

                <Group>
                    <Title order={1}>Admin Dashboard</Title>
                    <Switch
                        onLabel="Products"
                        offLabel="Users"
                        color="gray"
                        size="xl"
                        onChange={() => setWhichTable(whichTable == 0 ? 1 : 0)}
                    />
                </Group>
                

                {whichTable == 0 ? (
                    <Table striped sx={{ minWidth: 800 }} verticalSpacing="sm">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Status</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>{usersRow}</tbody>
                    </Table>
                ) : (


                    <Table striped sx={{ minWidth: 800 }} verticalSpacing="sm">
                        <thead>
                            <tr>
                                <th>Inventory Id</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Image</th>
                                <th>Approve</th>
                                <th>Remove From Site    </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>{newItems}</tbody>
                    </Table>

                )}
            </Container>
        );
    }

    else {
        return (
            <Container size="lg" px="md">
                <Text size="lg" weight={500} style={{ marginTop: 64 }}>
                    Welcome to your profile, {state.user.firstName}!
                </Text>

                <Text>
                    Email address: {state.user.email}
                </Text>

                <Text>
                    Transaction History:
                </Text>

                <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Total</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Container>
        );
    }
}

export default ProfilePage;