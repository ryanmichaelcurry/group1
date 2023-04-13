import React, { createContext, useEffect, useState, useContext } from 'react';
import { ApiContext } from './ApiContext';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {

  const { send } = useContext(ApiContext);

  const [inventory, setInventory] = useState([]);
  const [earnings, setEarnings] = useState([]);
  

  useEffect(async () => {
    let response = await send("GET:/inventory");
    setInventory(response.inventory);

  

    const [cart, setCart] = useState(item_ids: [], item_quantities: [] }]);

    // this should be next available from backend
    const cart_id = 12345;


    /*
    response = await send("GET:/cart");
    console.log("CART!!!!", response);
    setCart(response.cart);
    */


    response = await send("GET:/earnings");
    setEarnings(response.earnings);
  }, []);

 

    const uploadProduct = (newProduct) => {
        // contact backend here

    };

    function increaseCartQuantity(invId, qtyIncrease) {
        setCart(prevCart => {
            console.log("Cart before item added/increased: ", console.log(prevCart));

            const index = prevCart.item);
            console.log("index: ", index);
            if (index != -1) {
                // already in list
                const newQty = prevCart.item_quantities[index] + qtyIncrease;

                const updatedCart = [...prevCart]; // create a copy of the cart array
                updatedCart[index] = { ...updatedCart[index], item_quantities: newQty }; // update the item_quantity at specified index
                return updatedCart;
            }

            else {
                // not currently in list
                const updatedCart = [...prevCart]; // create a copy of the cart array
                updatedCart[index] = { ...updatedCart[index], item_ids: invId, item_quantities: newQty }; // update the item_ids and item_quantities of property at the specified index
                return updatedCart;
            }
        });
    }

    //function decreaseCartQuantity(invId, qtyDecrease) {
    //    setCart(prevCart => {

    //        const index = prevCart.item_ids.findIndex(invId);
    //        if (index != -1) {
    //            // already in list
    //            const newQty = prevCart.item_quantities[index] - qtyIncrease;
    //            //if newQty < 0 

    //            const updatedCart = [...prevCart]; // create a copy of the cart array
    //            updatedCart[index] = { ...updatedCart[index], item_quantities: newQty }; // update the item_quantity at specified index
    //            return updatedCart;
    //        }

    //        else {
    //            // not currently in list, return current cart with nothing removed
    //            return prevCart;
    //        }
    //    });
    //}




    function getItemQuantity(id) {
        return cart.item_ids.find(ids => ids === id)?.quantity || 0
    }









    
    
    //function decreaseCartQuantity(id: number) {
    //    setCartItems(currItems => {
    //        if (currItems.find(item => item.id === id)?.quantity === 1) {
    //            return currItems.filter(item => item.id !== id)
    //        } else {
    //            return currItems.map(item => {
    //                if (item.id === id) {
    //                    return { ...item, quantity: item.quantity - 1 }
    //                } else {
    //                    return item
    //                }
    //            })
    //        }
    //    })
    //}
    //function removeFromCart(id: number) {
    //    setCartItems(currItems => {
    //        return currItems.filter(item => item.id !== id)
    //    })
    //}



























    return <StoreContext.Provider value={{ cart, products, setProducts, setCart, uploadProduct, increaseCartQuantity }}>{children}</StoreContext.Provider>;

};
