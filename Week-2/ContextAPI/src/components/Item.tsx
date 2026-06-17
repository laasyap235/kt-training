import { useContext } from 'react'
import { CartContext } from '../context/Cart.tsx'

function Item({ title, price }: { title: string; price: number }) {
  const cart = useContext(CartContext);

  if (!cart) return null; 

  return (
    <div className="item-card">
      <h3>{title}</h3>
      <p>Price: {price}</p>
      <button onClick={() => cart.setItems([...cart.items, { title, price }])}>
        Add to Cart
      </button>
    </div>
  );
}

export default Item;