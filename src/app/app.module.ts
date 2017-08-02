import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { StuffDetailPage } from './../pages/stuff-detail/stuff-detail';
import { MainEffects } from './store/mainEffects';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { mainAppStoreReducer } from '../app/store/mainReducer';


// Must export the config
export const firebaseConfig = {

};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    StoreModule.forRoot({ app :mainAppStoreReducer }),
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
  providers: [ StatusBar, SplashScreen]
})
export class AppModule { }
