import * as types from "./actionTypes.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const signinStart = () => ({
  type: types.SIGNIN_START,
});

const signinSuccess = (admin) => ({
  type: types.SIGNIN_SUCCESS,
  payload: admin,
});

const signinFail = (error) => ({
  type: types.SIGNIN_FAIL,
  payload: error,
});

export const setUser = (admin) => ({
  type: types.SET_USER,
  payload: admin,
});

const logoutStart = () => ({
  type: types.LOGOUT_START
})

const logoutEnd = () => ({
  type: types.LOGOUT_END
})

export const signinInitiate = (email, password) => {
  return function (dispatch) {
    const auth = getAuth();
    dispatch(signinStart());
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(signinSuccess(user));
      })
      .catch((error) => {
        dispatch(signinFail(error.message));
      });
  };
};


export const logoutInitiate = () => {
  
  return function (dispatch){
    const auth = getAuth()
    dispatch(logoutStart())
    auth.signOut()
    dispatch(logoutEnd())
  }
}