import React, { createContext, useEffect, useState, useContext } from 'react';
import { ApiContext } from './ApiContext';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { send } = useContext(ApiContext);

  const [inventory, setInventory] = useState([]);
    const [earnings, setEarnings] = useState([]);

    // cartItem Decl
    class CartItem {
        constructor(inventory_id, quantity, price) {
            this.inventory_id = inventory_id;
            this.quantity = quantity;
            this.price = price;
        }
    }


    // create state hook of items in cart
    const [cartItems, setCartItems] = useState([]);

    // fetch next available cart_id from backend
    const [cartDetails, setCartDetails] = useState([{ cart_id: 12345, }])


    const addNewCartItem = (id, qty, price) => {
        const newClassObject = new CartItem(id, qty, price);
        setCartItems([...cartItems, newClassObject]);
        send("POST:/cart", {inventory_id: id, quantity: qty});
    }

    const addItemToCart = (id, qty, price) => {
        // see if item is already in cart and store index if so
        const ind = cartItems.findIndex(item => { return item.inventory_id == id });

        if (ind == -1) {
            // item is not in cart yet. call addNewCartItems
            addNewCartItem(id, qty, price);
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
            send("PUT:/cart", {inventory_id: id, quantity: qty});
        }
    }


   
    // remove from cart. Send inventory_id
    const removeItemFromCart = (inv_id) => {
        const filteredItems = cartItems.filter(classObj => classObj.inventory_id !== inv_id);
        setCartItems(filteredItems);
        send("DELETE:/cart", {inventory_id: inv_id});
    }

    // increase qty of item in cart by 1
    const increaseItemQty = (inv_id) => {
        const updatedArr = cartItems.map((item) => {
            if (item.inventory_id == inv_id) {
                item.quantity++;
            }
            return item;
        });
        setCartItems(updatedArr);
        send("PUT:/cart", {inventory_id: id, quantity: 1});
    }

    // decrease qty of item in cart by 1
    const decreaseItemQty = (inv_id) => {
        const updatedArr = cartItems.map((item) => {
            if (item.inventory_id == inv_id) {
                item.quantity--;
            }
            return item;
        });
        setCartItems(updatedArr);
        send("PUT:/cart", {inventory_id: id, quantity: -1});
    }



    const cartTotal = cartItems.reduce(
        (runningTot, currentItem) => runningTot + (currentItem.quantity * currentItem.price), 0
    )




  useEffect(async () => {
    let response = await send("GET:/inventory");
    setInventory(response.inventory);

    
    response = await send("GET:/cart");
    console.log("CART!!!!", response);
    setCartItems(response.cart);
    

    //  response = await send("GET:/earnings");
    //  console.log("earnings response: ", response);
    //if(response.earnings != null) setEarnings(response.earnings);
  }, []);

    return <StoreContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, increaseItemQty, decreaseItemQty, cartTotal, inventory, earnings }}>{children}</StoreContext.Provider>;
};
