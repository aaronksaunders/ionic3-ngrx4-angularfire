
export const LOGIN: string = "LOGIN";
export const LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
export const LOGIN_FAILED: string = "LOGIN_FAILED";
export const LOGOUT: string = "LOGOUT";
export const LOGOUT_SUCCESS: string = "LOGOUT_SUCCESS";
export const LOGOUT_FAILED: string = "LOGOUT_FAILED"

export const CREATE_USER: string = "CREATE_USER";
export const CREATE_USER_SUCCESS: string = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILED: string = "CREATE_USER_FAILED"

export const GET_FIREBASE_ARRAY: string = "GET_FIREBASE_ARRAY";
export const GET_FIREBASE_ARRAY_SUCCESS: string = "GET_FIREBASE_ARRAY_SUCCESS";
export const GET_FIREBASE_ARRAY_FAILED: string = "GET_FIREBASE_ARRAY_FAILED"

export const GET_FIREBASE_OBJECT: string = "GET_FIREBASE_OBJECT";
export const GET_FIREBASE_OBJECT_SUCCESS: string = "GET_FIREBASE_OBJECT_SUCCESS";
export const GET_FIREBASE_OBJECT_FAILED: string = "GET_FIREBASE_OBJECT_FAILED"

export const CREATE_FIREBASE_OBJECT: string = "CREATE_FIREBASE_OBJECT";
export const CREATE_FIREBASE_OBJECT_SUCCESS: string = "CREATE_FIREBASE_OBJECT_SUCCESS";
export const CREATE_FIREBASE_OBJECT_FAILED: string = "CREATE_FIREBASE_OBJECT_FAILED"

export const DELETE_FIREBASE_OBJECT: string = "DELETE_FIREBASE_OBJECT";
export const DELETE_FIREBASE_OBJECT_SUCCESS: string = "DELETE_FIREBASE_OBJECT_SUCCESS";
export const DELETE_FIREBASE_OBJECT_FAILED: string = "DELETE_FIREBASE_OBJECT_FAILED"

export const CHECK_AUTH: string = "CHECK_AUTH";
export const CHECK_AUTH_SUCCESS: string = "CHECK_AUTH_SUCCESS";
export const CHECK_AUTH_NO_USER: string = "CHECK_AUTH_NO_USER";
export const CHECK_AUTH_FAILED: string = "CHECK_AUTH_FAILED";

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

  deleteFirebaseObject = ({$key, objectType}) => {
    return {
      type: DELETE_FIREBASE_OBJECT,
      payload: { $key, objectType }
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

