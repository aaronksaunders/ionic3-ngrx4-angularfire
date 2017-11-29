import { 
  CHECK_AUTH, 
  LOGOUT, 
  LOGIN, 
  CREATE_USER, 
  GET_FIREBASE_ARRAY, 
  GET_FIREBASE_OBJECT,
  CREATE_FIREBASE_OBJECT
 } from './mainReducer';

export class All {
  checkAuthAction = () => { return { type: CHECK_AUTH } }
  logoutAction = () => { return { type: LOGOUT } }
  loginAction = (credentials) => {
    return {
      type: LOGIN,
      payload: credentials
    }
  }
  createUserAction = (credentials) => {
    return {
      type: CREATE_USER,
      payload: credentials
    }
  }

  createFirebaseObject = (params) => {
    return {
      type: CREATE_FIREBASE_OBJECT,
      payload: params
    }
  }

  deleteFirebaseObject = ($key) => {
    return {
      type: CREATE_FIREBASE_OBJECT,
      payload: $key
    }
  }

  fetchFirebaseArrayAction = (params) => {
    return {
      type: GET_FIREBASE_ARRAY,
      payload: params
    }
  };

  fetchFirebaseObjectAction = (params) => {
    return {
      type: GET_FIREBASE_OBJECT,
      payload: params
    }
  };
}

