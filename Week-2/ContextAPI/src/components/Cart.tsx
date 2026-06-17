import { useContext } from 'react'
import { CartContext } from '../context/Cart.tsx'
function Cart() {
  const cart = useContext(CartContext);
  const total = cart?.items.reduce((a,b) => a + b.price, 0) || 0;

  return (
    <div className="cart-card">
        <h2>Shopping Cart</h2>
        {
            cart && cart.items.map((item, index) => (
                <div key={index}>
                    <li>{item.title} - {item.price.toFixed(2)}</li>
                </div>
            ))
        }
        

      <h3>Total: {total.toFixed(2)}</h3>
    </div>
  )
}
export default Cart;