import {
  SET_ORDER_TYPE
   
  } from '../constants/orderTypeConstants'
  
  export const orderTypeReducer = (state = {}, action) => {
    switch (action.type) {
      case SET_ORDER_TYPE:
        return {
          type:action.payload
        }
      default:
        return state
    }
  }
  