import { Text, Container, Button, Modal, TextInput } from '@mantine/core';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StoreContext } from '../context/StoreContext';

export function ProfilePage() {
    const { state } = useContext(AuthContext);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [itemData, setItemData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        image_url: '',
    });

    const handleUpload = async () => {
        const response = { success: false };
        if (response.success) {
            setShowUploadModal(false);
            setItemData({
                title: '',
                description: '',
                price: '',
                quantity: '',
                image_url: '',
            });
        }
    };

    if (state.user.type == 1) {
        return (
            <Container size="lg" px="md">
                <Text size="lg" weight={500} style={{ marginTop: 64 }}>
                    Welcome to your profile, {state.user.firstName}!
                </Text>

                <Text>
                    Email address: {state.user.email}
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
    else {
        return (
            <Container size="lg" px="md">
                <Text size="lg" weight={500} style={{ marginTop: 64 }}>
                    Welcome to your profile, {state.user.firstName}!
                </Text>

                <Text>
                    Email address: {state.user.email}
                </Text>
            </Container>
        );
    }
}

export default ProfilePage;
