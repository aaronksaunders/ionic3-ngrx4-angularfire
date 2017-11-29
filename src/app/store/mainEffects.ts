import { Injectable } from '@angular/core';
import {
    CHECK_AUTH, CHECK_AUTH_SUCCESS, CHECK_AUTH_FAILED,
    CHECK_AUTH_NO_USER, LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILED,
    LOGIN, LOGIN_SUCCESS, LOGIN_FAILED, CREATE_USER, CREATE_USER_SUCCESS,
    CREATE_USER_FAILED, GET_FIREBASE_ARRAY, GET_FIREBASE_ARRAY_SUCCESS,
    GET_FIREBASE_ARRAY_FAILED,
    GET_FIREBASE_OBJECT, GET_FIREBASE_OBJECT_SUCCESS,
    GET_FIREBASE_OBJECT_FAILED,
    CREATE_FIREBASE_OBJECT, CREATE_FIREBASE_OBJECT_SUCCESS,
    CREATE_FIREBASE_OBJECT_FAILED,
    DELETE_FIREBASE_OBJECT, DELETE_FIREBASE_OBJECT_SUCCESS,
    DELETE_FIREBASE_OBJECT_FAILED
} from './mainReducer';


import { of } from "rxjs/observable/of";
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Effect, Actions, toPayload } from "@ngrx/effects";

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class MainEffects {

    constructor(private action$: Actions,
        public auth$: AngularFireAuth,
        public af: AngularFireDatabase) {
        console.log(this.auth$.auth.currentUser)
    }
    @Effect({ dispatch: false }) logActions$ = this.action$
        .do(action => {
            console.log('logActions$', action);
        });

    @Effect() login$ = this.action$.ofType('LOGIN')
        .map(toPayload)
        .switchMap(payload => {
            return this.doAuth(payload)
        })

    @Effect() createUser$ = this.action$
        // Listen for the 'LOGOUT' action
        .ofType(CREATE_USER)
        .map(toPayload)
        .switchMap(payload => {
            console.log("in createUser$", payload)
            return this.doCreateUser(payload)
        })


    @Effect() checkAuth$ = this.action$.ofType('CHECK_AUTH')
        .do((action) => console.log(`Received ${action.type}`))
        .switchMap(() => this.auth$.authState)
        .map((_result) => {
            if (_result) {
                console.log("in auth subscribe", _result)
                return { type: 'CHECK_AUTH_SUCCESS', payload: _result }
            } else {
                console.log("in auth subscribe - no user", _result)
                return { type: 'CHECK_AUTH_NO_USER', payload: null }
            }

        }).catch((res: any) => Observable.of({ type: CHECK_AUTH_FAILED, payload: res }))


    @Effect() logout$ = this.action$.ofType('LOGOUT')
        .do((action) => console.log(`Received ${action.type}`))
        .switchMap(() => this.auth$.auth.signOut())
        // If successful, dispatch success action with result
        .map((res: any) => ({ type: LOGOUT_SUCCESS, payload: null }))
        // If request fails, dispatch failed action
        .catch((res: any) => Observable.of({ type: LOGOUT_FAILED, payload: res }))


    @Effect() createFBObject$ = this.action$
        // Listen for the 'CREATE_FIREBASE_OBJECT' action
        .ofType(CREATE_FIREBASE_OBJECT)
        .map(toPayload)
        .switchMap(payload => {
            debugger
            console.log("in createFBObject$", payload)
            return this.doCreateFirebaseObject(payload)
        })


    @Effect() deleteFBObject$ = this.action$
        // Listen for the 'DELETE_FIREBASE_OBJECT' action
        .ofType(DELETE_FIREBASE_OBJECT)
        .map(toPayload)
        .switchMap(payload => {
            console.log("in deleteFBObject$", payload)
            return this.doDeleteFirebaseObject(payload)
        })


    @Effect() getFBArray$ = this.action$.ofType('GET_FIREBASE_ARRAY', 'CREATE_FIREBASE_OBJECT_SUCCESS')
        .do((action) => console.log(`Received ${action.type}`))
        .switchMap(payload => {
            return this.doFirebaseLoadArray(payload)
        })



    @Effect() getFBObject$ = this.action$
        // Listen for the 'LOGOUT' action
        .ofType(GET_FIREBASE_OBJECT)
        .map(toPayload)
        .switchMap(payload => {
            return this.doFirebaseLoadObject(payload)
        })

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // MOVE ALL OF THIS TO A SEPERATE SERVICE
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    doAuth(_creds) {
        console.log("in do auth", _creds)
        return Observable.create((observer) => {
            this.auth$.auth.signInWithEmailAndPassword(_creds.email, _creds.password)
                .then((_result) => {
                    return observer.next({ type: LOGIN_SUCCESS, payload: _result })
                }, (error) => {
                    console.log("error", error)
                    return observer.next({ type: LOGIN_FAILED, payload: error })
                })
        })
    }

    doCreateUser(_creds) {
        return Observable.create((observer) => {
            this.auth$.auth.createUserWithEmailAndPassword(_creds.email, _creds.password)
                .then((_result) => {
                    console.log("_result", _result)
                    return observer.next({ type: CREATE_USER_SUCCESS, payload: _result })
                }, (error) => {
                    console.log("error", error)
                    return observer.next({ type: CREATE_USER_FAILED, payload: error })
                })
        })
    }

    /**
     * 
     * 
     * @param {any} { objectType, objectData } 
     * @returns 
     * @memberof MainEffects
     */
    doCreateFirebaseObject({ objectType, objectData }) {
        return Observable.create((observer) => {

            // key an id for the object
            let key = this.af.database.ref().child(objectType).push().key;

            // create the object as an update with the path
            // and the key info
            var updates = {};
            updates[`${objectType}/${key}`] = objectData;

            // update the database
            this.af.database.ref().update(updates)
                .then((_result) => {
                    return observer.next({
                        type: CREATE_FIREBASE_OBJECT_SUCCESS,
                        payload: { object: { ...objectData, $key: key }, path: objectType }
                    })
                }, (error) => {
                    console.log("error", error)
                    return observer.next({ type: CREATE_FIREBASE_OBJECT_FAILED, payload: error })
                })
        });
    }


    doDeleteFirebaseObject({ objectType, $key }) {
        return Observable.create((observer) => {

            // key an id for the object
            this.af.list(objectType).remove($key)
                .then((_result) => {
                    return observer.next({
                        type: DELETE_FIREBASE_OBJECT_SUCCESS,
                        payload: { $key }
                    })
                }, (error) => {
                    console.log("error", error)
                    return observer.next({ type: DELETE_FIREBASE_OBJECT_FAILED, payload: error })
                })
        });
    }

    doFirebaseLoadArray(_params) {
        return Observable.create((observer) => {
            var path = _params.payload.path
            this.af.list(path).snapshotChanges()
                .take(1)
                .subscribe(items => {
                    // we need to iterate through the snapshot to
                    // get the values, but also include the $key
                    // in the object for later use
                    observer.next({
                        type: GET_FIREBASE_ARRAY_SUCCESS,
                        payload: items.map((i) => {
                            return {
                                $key: i.key, ...i.payload.val()
                            }
                        })
                    })
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: GET_FIREBASE_ARRAY_FAILED, payload: error })
                })
        })
    }
    doFirebaseLoadObject(_params) {
        return Observable.create((observer) => {
            this.af.object(_params.path).valueChanges()
                .take(1)
                .subscribe(items => {
                    observer.next({ type: GET_FIREBASE_OBJECT_SUCCESS, payload: items })
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: GET_FIREBASE_OBJECT_FAILED, payload: error })
                })
        })
    }
}