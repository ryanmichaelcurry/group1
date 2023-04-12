import React, { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([
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
  ]);

    const [cart, setCart] = useState([{ cart_id: 0, cart_num_items: 0, checkout: false, item_ids: [], item_quantities: [] }]);






  return <StoreContext.Provider value={{ cart, products, setProducts, setCart }}>{children}</StoreContext.Provider>;
};
