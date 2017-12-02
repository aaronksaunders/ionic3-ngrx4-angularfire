import { Injectable } from '@angular/core';
import * as actions from './mainActions'


import { of } from "rxjs/observable/of";
import { Observable } from 'rxjs';
import { Effect, Actions, toPayload } from "@ngrx/effects";

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
//import { map } from 'rxjs/operator/map';


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

    @Effect() login$ = this.action$.ofType(actions.LOGIN)
        .map(toPayload)
        .switchMap(payload => { return this.doAuth(payload) })
        .map((_result) => {
            return { type: actions.LOGIN_SUCCESS, payload: _result }
        }).catch((error) => {
            console.log("error", error)
            return of({ type: actions.LOGIN_FAILED, payload: error })
        })

    @Effect() createUser$ = this.action$
        // Listen for the 'CREATE_USER' action
        .ofType(actions.CREATE_USER)
        .map(toPayload)
        .switchMap(payload => { return this.doCreateUser(payload) })
        .map((_result) => {
            console.log("_result", _result)
            return { type: actions.CREATE_USER_SUCCESS, payload: _result }
        }).catch((error) => {
            console.log("error", error)
            return of({ type: actions.CREATE_USER_FAILED, payload: error })
        })


    @Effect() checkAuth$ = this.action$.ofType(actions.CHECK_AUTH)
        .do((action) => console.log(`Received ${action.type}`))
        .switchMap(() => this.auth$.authState)
        .map((_result) => {
            debugger
            if (_result) {
                console.log("in auth subscribe", _result)
                return { type: actions.CHECK_AUTH_SUCCESS, payload: _result }
            } else {
                console.log("in auth subscribe - no user", _result)
                return { type: actions.CHECK_AUTH_NO_USER, payload: null }
            }

        }).catch((res: any) => Observable.of({ type: actions.CHECK_AUTH_FAILED, payload: res }))


    @Effect() logout$ = this.action$.ofType(actions.LOGOUT)
        .do((action) => console.log(`Received ${action.type}`))
        .switchMap(() => this.auth$.auth.signOut())
        // If successful, dispatch success action with result
        .map((res: any) => ({ type: actions.LOGOUT_SUCCESS, payload: null }))
        // If request fails, dispatch failed action
        .catch((res: any) => Observable.of({ type: actions.LOGOUT_FAILED, payload: res }))



    @Effect() getFBArray$ = this.action$.ofType(actions.GET_FIREBASE_ARRAY)
        .do((action) => console.log(`Received ${action.type}`))
        .switchMap(payload => {
            return this.doFirebaseLoadArray(payload)
                .map((items) => {
                    console.log(items)
                    return { type: actions.GET_FIREBASE_ARRAY_SUCCESS, payload: items }
                })
                .catch((error) => {
                    return of({ type: actions.GET_FIREBASE_ARRAY_FAILED, payload: error })
                })
        })

    @Effect() getFBObject$ = this.action$
        // Listen for the 'GET_FIREBASE_OBJECT' action
        .ofType(actions.GET_FIREBASE_OBJECT)
        .map(toPayload)
        .switchMap(payload => {
            return this.doFirebaseLoadObject(payload)
                .map((item) => {
                    console.log(item)
                    return { type: actions.GET_FIREBASE_OBJECT_SUCCESS, payload: item }
                })
                .catch((error) => {
                    return of({ type: actions.GET_FIREBASE_OBJECT_FAILED, payload: error })
                })
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
        return this.auth$.auth.signInWithEmailAndPassword(_creds.email, _creds.password)
    }

    doCreateUser(_creds) {
        return this.auth$.auth.createUserWithEmailAndPassword(_creds.email, _creds.password)
    }

    doFirebaseLoadArray(_params) {
        var path = _params.payload.path
        return this.af.list(path).take(1)
    }

    doFirebaseLoadObject(_params) {
        return this.af.object(_params.path).take(1)
    }
}