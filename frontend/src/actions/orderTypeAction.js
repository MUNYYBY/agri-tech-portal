
import {
    SET_ORDER_TYPE
} from '../constants/orderTypeConstants'

export const orderType = (type) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ORDER_TYPE,
      payload:type
    })

    }
    catch(error){
        return error;
    }
}