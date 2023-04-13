import React, { createContext, useEffect, useState, useContext } from 'react';
import { ApiContext } from './ApiContext';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { send } = useContext(ApiContext);

  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [earnings, setEarnings] = useState([]);

  useEffect(async () => {
    let response = await send("GET:/inventory");
    setInventory(response.inventory);

    response = await send("GET:/cart");
    console.log("CART!!!!", response);
    setCart(response.cart);

    response = await send("GET:/earnings");
    setEarnings(response.earnings);
  }, []);

  return <StoreContext.Provider value={{ cart, inventory, earnings }}>{children}</StoreContext.Provider>;
};
