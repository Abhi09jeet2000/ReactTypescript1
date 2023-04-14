import React, { useEffect } from 'react'
import pizzas from '../data/pizzas.json'
import PizzaItem from './PizzaItem'
import AppCss from './App.module.css'
import PizzaSVG from '../svg/pizza.svg'
import Cart from './Cart'
import AppStateProvider from './AppState'
import SpecialOffer from './SpecialOffer'
const App = () => {
  const specialOfferPizza = pizzas.find((pizza) => pizza.specialDiscount)

  // useEffect(() => {
  //   const listener = () => {
  //     alert('Hello')
  //   }
  //   document.addEventListener('mousedown', listener)
  //   return () => {
  //     document.removeEventListener('mousedown', listener)
  //   }
  // }, [])
  return (
    <AppStateProvider>
      <div className={AppCss.container}>
        {/* <PizzaSVG width={120} height={120} /> */}
        <div className={AppCss.header}>
          <div className={AppCss.setTitle}>Pizza</div>
          <Cart />
        </div>
        {specialOfferPizza && <SpecialOffer pizza={specialOfferPizza} />}
        <ul className={AppCss.pizzaList}>
          {pizzas.map((pizza) => {
            return <PizzaItem key={pizza.id} pizza={pizza} />
          })}
        </ul>
      </div>
    </AppStateProvider>
  )
}

export default App
