import * as types from "./actionTypes";

const initialState = {
  loading: true,
  currentAdmin: null,
  error: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SIGNIN_START:
    case types.LOGOUT_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        currentAdmin: action.payload,
      };

    case types.SIGNIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.SET_USER:
      return {
        ...state,
        loading: false,
        currentAdmin: action.payload,
      };

    case types.LOGOUT_END:
      return {
        ...state,
        loading: false,
        currentAdmin: null,
      };
    default:
      return state;
  }
};

export default adminReducer;
