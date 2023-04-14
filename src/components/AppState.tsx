import React, { createContext, useContext, useEffect, useReducer } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export interface AppStateValue {
  cart: {
    items: CartItem[]
  }
}

export const defaultStateValue: AppStateValue = {
  cart: {
    items: [],
  },
}

interface Props {
  children: React.ReactNode
}

export const AppStateContext = createContext(defaultStateValue)

export const AppDispatchContext = createContext<
  React.Dispatch<AddToCartAction> | undefined
>(undefined)

interface Action<T> {
  type: T
}

interface AddToCartAction extends Action<'ADD_TO_CART'> {
  payload: {
    item: Omit<CartItem, 'quantity'>
  }
}

interface InitializeCartAction extends Action<'INITIALIZE_CART'> {
  payload: {
    item: AppStateValue['cart']
  }
}

const reducer = (
  state: AppStateValue,
  action: AddToCartAction | InitializeCartAction,
) => {
  if (action.type === 'ADD_TO_CART') {
    const itemToAdd = action.payload.item
    const itemExists = state.cart.items.find((item) => item.id === itemToAdd.id)
    return {
      ...state,
      cart: {
        ...state.cart,
        items: itemExists
          ? state.cart.items.map((item) => {
              if (item.id == itemToAdd.id) {
                return { ...item, quantity: item.quantity + 1 }
              }
              return item
            })
          : [
              ...state.cart.items,
              {
                id: itemToAdd.id,
                name: itemToAdd.name,
                price: itemToAdd.price,
                quantity: 1,
              },
            ],
      },
    }
  } else if (action.type === 'INITIALIZE_CART') {
    return { ...state, cart: action.payload.item }
  }
  return state
}

export const useStateDispatch = () => {
  const dispatch = useContext(AppDispatchContext)
  if (!dispatch) {
    throw new Error(
      'useState was called outside of the AppDispatchContext provider',
    )
  }
  return dispatch
}

const AppStateProvider: React.FC<Props> = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, defaultStateValue)

  useEffect(() => {
    console.log(1)
    const cart = window.localStorage.getItem('cart')
    if (cart) {
      dispatch({ type: 'INITIALIZE_CART', payload: { item: JSON.parse(cart) } })
    }
  }, [])

  useEffect(() => {
    console.log(2)
    window.localStorage.setItem('cart', JSON.stringify(state.cart))
  }, [state.cart])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {props.children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export default AppStateProvider
