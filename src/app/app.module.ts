import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StuffDetailPage } from './../pages/stuff-detail/stuff-detail';

// NGRX
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MainEffects } from './store/mainEffects';
import { mainAppStoreReducer } from '../app/store/mainReducer';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ANGULARFIRE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseProps } from './../environment'

// Must export the config, create a file in the /src/environment.ts that
// looks like this..
//
// export const firebaseProps = {
//     "apiKey": " ",
//     "authDomain": " ",
//     "databaseURL": " ",
//     "projectId": " ",
//     "storageBucket": " ",
//     "messagingSenderId": ""
// }
export const firebaseConfig = {
  ...firebaseProps
};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    StoreModule.forRoot({ app: mainAppStoreReducer }),
    EffectsModule.forRoot([MainEffects]),
    IonicModule.forRoot(MyApp),
    BrowserModule,
    StoreDevtoolsModule.instrument()
  ],
  declarations: [
    MyApp,
    HomePage,
    StuffDetailPage
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    StuffDetailPage
  ],
  providers: [StatusBar, SplashScreen]
})
export class AppModule { }
