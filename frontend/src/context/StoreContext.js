import React, { createContext, useEffect, useState, useContext } from 'react';
import { ApiContext } from './ApiContext';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { send } = useContext(ApiContext);

  const [inventory, setInventory] = useState([]);
    const [earnings, setEarnings] = useState([]);

    // cartItem Decl
    class CartItem {
        constructor(inventory_id, quantity) {
            this.inventory_id = inventory_id;
            this.quantity = quantity;
        }
    }


    // create state hook of items in cart
    const [cartItems, setCartItems] = useState([]);

    // fetch next available cart_id from backend
    const [cartDetails, setCartDetails] = useState([{ cart_id: 12345, }])


    const addNewCartItem = (id, qty) => {
        const newClassObject = new CartItem(id, qty);
        setCartItems([...cartItems, newClassObject]);
    }

    const addItemToCart = (id, qty) => {
        // see if item is already in cart and store index if so
        const ind = cartItems.findIndex(item => { return item.inventory_id == id });

        if (ind == -1) {
            // item is not in cart yet. call addNewCartItems
            addNewCartItem(id, qty);
        }
        else {
            // item is already in cart. Adjust quantity at index
            const updatedArr = cartItems.map((cartItemInstance, i) => {
                if (i === ind) {
                    cartItemInstance.quantity += qty;
                }
                return cartItemInstance;
            });
            setCartItems(updatedArr);
        }
    }


   
    // remove from cart. Send inventory_id
    const removeItemFromCart = (inv_id) => {
        const filteredItems = classArray.filter(classObj => classObj.inventory_id !== inv_id);
        setCartItems(filteredItems);
    }






  useEffect(async () => {
    let response = await send("GET:/inventory");
    setInventory(response.inventory);

    /*
    response = await send("GET:/cart");
    console.log("CART!!!!", response);
    setCart(response.cart);
    */

    response = await send("GET:/earnings");
    setEarnings(response.earnings);
  }, []);

    return <StoreContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, inventory, earnings }}>{children}</StoreContext.Provider>;
};
