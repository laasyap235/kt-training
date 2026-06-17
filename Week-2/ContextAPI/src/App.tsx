
import './App.css'
import Item from './components/Item'
import Cart from './components/Cart'
function App() {
  

  return (
    <>
    <Item title="Laptop" price={19.99} />
    <Item title="Smartphone" price={9.99} />
    <Item title="Tablet" price={14.99} />
    <br />
    <Cart />
    
      
    </>
  )
}

export default App
