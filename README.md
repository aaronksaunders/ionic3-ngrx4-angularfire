# Ionic3.0 Angularfire2 w/ state management using ngrx4

 ![ionic2](https://raw.githubusercontent.com/aaronksaunders/ionic2.0-angularfire/master/Untitled.png)

## A basic application for Ionic 3  with AngularFire2 & ngrx4 Integration

- Login with email address & password
- Automatically login if a session already exists
- Create accounts
- Login with Account
- Integration of ngrx/store & ngrx/effects to manage state
- Query List Objects
- Find a specific List Object

## Ionic Version Information

```console

cli packages: (/Users/aaronsaunders/.nvm/versions/node/v6.10.2/lib/node_modules)

    @ionic/cli-utils  : 1.19.0
    ionic (Ionic CLI) : 3.19.0

local packages:

    @ionic/app-scripts : 3.1.2
    Ionic Framework    : ionic-angular 3.9.2

System:

    Node : v6.10.2
    npm  : 3.10.10
    OS   : macOS Sierra

Misc:

    backend : pro

```

## Firebase Configuration

Must export the config, create a file in the `/src/environment.ts` that looks like this..

see comment in code - https://github.com/aaronksaunders/ionic3-ngrx4-angularfire/blob/master/src/app/app.module.ts#L26

```
export const firebaseProps = {
   "apiKey": " ",
   "authDomain": " ",
   "databaseURL": " ",
   "projectId": " ",
   "storageBucket": " ",
   "messagingSenderId": ""
}
```

## More Information on ngRx4

* More Information on ngrx/store: [https://github.com/ngrx/platform/blob/master/docs/store/README.md](https://github.com/ngrx/platform/blob/master/docs/store/README.md)
* More Information on ngrx/effects: [https://github.com/ngrx/platform/blob/master/docs/effects/README.md](https://github.com/ngrx/platform/blob/master/docs/effects/README.md)
