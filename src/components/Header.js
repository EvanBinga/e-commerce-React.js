import React, { useState } from 'react'
import { FaCartShopping } from "react-icons/fa6";
import Order from './Order';


const showOrders = (props) => {
  return (<div>
    {props.orders.map(el=> (
        <Order key={el.id} item={el} onDelete={props.onDelete} /> // Pass onDelete here
      ))}
  </div>)
}

const showNothing = () => {
  return (<div className='empty'>
    <h2>Товаров нет</h2>
  </div>)
}

export default function Header(props) {
  let [cartOpen, setCartOpen] = useState(false);
  return (
<header>
    <div>
        <span className='logo'>Staff</span>
        <ul className='nav'>
          <li>Про нас</li>
          <li>Контакты</li>
          <li>Кабинет</li>
        </ul>

        {/* противоложное занччени пперменой через ! а не фолс и тру  */}
        <FaCartShopping onClick={()=> setCartOpen(cartOpen = !cartOpen)} className={`shop-cart-button ${cartOpen && 'active'}`} />




          {cartOpen && (
            <div className='shop-cart'>
                  {props.orders.length > 0 ?
                  showOrders(props) : showNothing()}
            </div>
          )}
    </div>
    <div className='presentation'></div>
</header>  )
}
