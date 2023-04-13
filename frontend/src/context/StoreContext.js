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
       // sample data above. ultimately this needs to get data from backend 
  ]);

    const [cart, setCart] = useState(item_ids: [], item_quantities: [] }]);

    // this should be next available from backend
    const cart_id = 12345;


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
