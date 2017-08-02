import { Injectable } from '@angular/core';
import {
    CHECK_AUTH, CHECK_AUTH_SUCCESS, CHECK_AUTH_FAILED,
    CHECK_AUTH_NO_USER, LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILED,
    LOGIN, LOGIN_SUCCESS, LOGIN_FAILED, CREATE_USER, CREATE_USER_SUCCESS,
    CREATE_USER_FAILED, GET_FIREBASE_ARRAY, GET_FIREBASE_ARRAY_SUCCESS,
    GET_FIREBASE_ARRAY_FAILED,
    GET_FIREBASE_OBJECT, GET_FIREBASE_OBJECT_SUCCESS,
    GET_FIREBASE_OBJECT_FAILED
} from './mainReducer';


import { of } from "rxjs/observable/of";
import { Observable } from 'rxjs';
import { Effect, Actions, toPayload } from "@ngrx/effects";

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';


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
        .take(1)
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



    @Effect() getFBArray$ = this.action$.ofType('GET_FIREBASE_ARRAY')
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

    doFirebaseLoadArray(_params) {
        return Observable.create((observer) => {
            var path = _params.payload.path
            var s: any = this.af.object(path)
            s.flatMap(() => this.af.list(path))
                .take(1)
                .subscribe(items => {
                    observer.next({ type: GET_FIREBASE_ARRAY_SUCCESS, payload: items })
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: GET_FIREBASE_ARRAY_FAILED, payload: error })
                })
        })
    }
    doFirebaseLoadObject(_params) {
        return Observable.create((observer) => {
            var s: any = this.af.object(_params.path)
            s.flatMap(() => this.af.object(_params.path))
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