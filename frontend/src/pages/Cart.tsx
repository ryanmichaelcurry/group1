interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  checkout: () => void;
}

const CartPage = ({ cartItems, checkout }: CartProps) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const renderCartItems = () => {
    return cartItems.map((item) => (
      <div key={item.id}>
        <div>{item.name}</div>
        <div>{item.price}</div>
        <div>{item.quantity}</div>
      </div>
    ));
  };

  return (
    <div>
      <h1>Cart Page</h1>
      <div>{renderCartItems()}</div>
      <div>
        Subtotal: <span>{subtotal}</span>
      </div>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
};

export default function Cart(): JSX.Element {
  const cartItems = [
    {
      id: 1,
      name: "Product 1",
      price: 10,
      quantity: 1,
    },
    {
      id: 2,
      name: "Product 2",
      price: 20,
      quantity: 2,
    },
  ];

  const checkout = () => {
    // implement checkout functionality here
  };

  return <CartPage cartItems={cartItems} checkout={checkout} />;
}