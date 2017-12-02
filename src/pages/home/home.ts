import { StuffDetailPage } from './../stuff-detail/stuff-detail';
import { Component, OnInit } from '@angular/core';


import { NavController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store'
import { State } from './../../app/store/mainReducer';
import { All } from './../../app/store/mainActions';
import { InputModalPage } from '../input-modal/input-modal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  //directives: [REACTIVE_FORM_DIRECTIVES]
})


export class HomePage implements OnInit {

  submitted = false;
  loginForm: FormGroup;
  storeInfo
  credentials: { email?: string, password?: string } = {};

  constructor(
    private builder: FormBuilder,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public store: Store<State>) {

    // use the object in the template since it is an observable
    this.storeInfo = this.store.select<any>('app');

    // here we are monitoring the authstate to do initial load of data
    this.store.select<any>('app')
      .subscribe((currentState: State) => {
        let { currentUser, dataArray, loading, error } = currentState
        console.log(currentState)
        if (currentUser !== null &&
          !dataArray &&
          loading === false &&
          !error) {
          this.doQuery()
        }

      });
  }


  ngOnInit() {



  }

  ionViewDidLoad() {
    this.store.dispatch(new All().checkAuthAction());
  }

  ionViewWillUnload() {
    this.storeInfo.complete();
  }


  doLogout() {
    this.store.dispatch(new All().logoutAction());
  }

  doLogin(_credentials) {
    this.submitted = true;

    if (_credentials.valid) {
      this.store.dispatch(new All().loginAction(_credentials.value))
    }

  }


  doCreateUser(_credentials) {
    this.submitted = true;

    if (_credentials.valid) {
      this.store.dispatch(new All().createUserAction(_credentials.value))
    }
  }

  doQuery() {
    this.store.dispatch(new All().fetchFirebaseArrayAction({ path: 'assets' }))
  }

  // doItemQuery
  doItemQuery(_item) {
    debugger
    this.navCtrl.push(StuffDetailPage, { itemId: _item.$key })
  }
  // doItemQuery
  doItemDelete(_item) {
    this.store.dispatch(new All().deleteFirebaseObject({ $key: _item.$key, objectType: 'assets' }))
  }

  presentModal() {
    let theModal = this.modalCtrl.create(InputModalPage, {});

    theModal.onDidDismiss(data => {
      console.log(data);
      if (data.success) {
        // HERE U UPDATE CONTENT... NOT SAVE
        this.store.dispatch(new All().createFirebaseObject({
          objectType: 'assets',
          objectData: {
            name: data.name,
            text: data.text,
            createdOn: new Date().toString()
          }
        }))
      }
    });

    theModal.present();
  }
}
