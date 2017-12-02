
import * as actions from './mainActions'

export const intitialState = {
  authChecked: false,
  currentUser: null,
  loading: false
}

export interface State {
  authChecked: boolean,
  currentUser: any,
  loading: boolean
  error?: any
  dataArray?: Array<any>
  dataObject?: Object
};



export function mainAppStoreReducer(state: State = intitialState, action: any) {

  switch (action.type) {

    case actions.LOGIN: {
      return Object.assign({}, state, { currentCreds: action.payload, loading: true })
    }

    case actions.LOGIN_SUCCESS: {
      return Object.assign({}, state, {
        currentUser: action.payload,
        currentCreds: null,
        error: null,
        loading: false
      })
    }

    case actions.LOGIN_FAILED: {
      return Object.assign({}, state, { error: action.payload, currentUser: null, authChecked: true, loading: false })
    }

    case actions.LOGOUT: {
      return Object.assign({}, state, { loading: true })
    }

    case actions.LOGOUT_SUCCESS: {
      return Object.assign({}, intitialState, { authChecked: true })
    }

    case actions.LOGOUT_FAILED: {
      return Object.assign({}, state, { error: action.payload, loading: false })
    }
    case actions.CHECK_AUTH: {
      return Object.assign({}, state, { loading: true })
    }

    case actions.CHECK_AUTH_SUCCESS: {
      return Object.assign({}, state, { currentUser: action.payload, authChecked: true, loading: false })
    }
    case actions.CHECK_AUTH_FAILED: {
      return Object.assign({}, state, { error: action.payload, currentUser: null, authChecked: true, loading: false })
    }
    case actions.CHECK_AUTH_NO_USER: {
      return Object.assign({}, state, { currentUser: null, authChecked: true, loading: false })
    }

    //
    case actions.CREATE_USER: {
      return Object.assign({}, state, { currentCreds: action.payload, loading: true })
    }

    case actions.CREATE_USER_SUCCESS: {
      return Object.assign({}, state, { currentUser: action.payload, authChecked: true, loading: false })
    }
    case actions.CREATE_USER_FAILED: {
      return Object.assign({}, state, { error: action.payload, currentUser: null, authChecked: true, loading: false })
    }

    case actions.GET_FIREBASE_ARRAY: {
      return Object.assign({}, state, { queryParams: action.payload, loading: true })
    }
    case actions.GET_FIREBASE_ARRAY_SUCCESS: {
      return Object.assign({}, state, { dataArray: action.payload, loading: false })
    }
    case actions.GET_FIREBASE_ARRAY_FAILED: {
      return Object.assign({}, state, { error: action.payload, loading: false })
    }
    case actions.GET_FIREBASE_OBJECT: {
      return Object.assign({}, state, { queryParams: action.payload, loading: true })
    }
    case actions.GET_FIREBASE_OBJECT_SUCCESS: {
      return Object.assign({}, state, { dataObject: action.payload, loading: false })
    }
    case actions.GET_FIREBASE_OBJECT_FAILED: {
      return Object.assign({}, state, { error: action.payload, loading: false })
    }

    // CREATE AN OBJECT IN THE DATASTORE
    case actions.CREATE_FIREBASE_OBJECT: {
      return Object.assign({}, state, { dataObject: action.payload, loading: true })
    }
    case actions.CREATE_FIREBASE_OBJECT_SUCCESS: {
      state.dataArray = [...state.dataArray, action.payload.object]
      return Object.assign({}, state, { dataObject: action.payload.object, loading: false })
    }
    case actions.CREATE_FIREBASE_OBJECT_FAILED: {
      return Object.assign({}, state, { error: action.payload, loading: false })
    }

    // DELETE AN OBJECT IN THE DATASTORE
    case actions.DELETE_FIREBASE_OBJECT: {
      return Object.assign({}, state, { loading: true })
    }
    case actions.DELETE_FIREBASE_OBJECT_SUCCESS: {
      let dataArray = state.dataArray.filter((i) => {
        return i.$key !== action.payload.$key
      })
      return Object.assign({}, state, { dataArray, dataObject: null, loading: false })
    }
    case actions.DELETE_FIREBASE_OBJECT_FAILED: {
      return Object.assign({}, state, { error: action.payload, loading: false })
    }

    default: {
      return state;
    }
  }
};