import { Store } from '@ngrx/store';
import { State } from './../../app/store/mainReducer';
import { All } from './../../app/store/mainActions';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the StuffDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-stuff-detail',
  templateUrl: 'stuff-detail.html'
})
export class StuffDetailPage {

  storeInfo: any

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<State>) {


    // use the object in the template since it is an observable
    this.storeInfo = this.store.select<any>('app');
    this.storeInfo.subscribe(({ dataObject }) => {
      console.log("mainAppStoreReducer store changed - ", dataObject)
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StuffDetailPage');
    let itemId = this.navParams.get('itemId');

    this.store.dispatch(new All().fetchFirebaseObjectAction({ path: `assets/${itemId}` }));
  }


  ionViewWillUnload() {
    this.storeInfo.complete();
  }



}
