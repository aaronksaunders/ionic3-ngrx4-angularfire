import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'input-modal.html'
})
export class InputModalPage {

    item = { name: "", text: "" };

    constructor(
        public viewCtrl: ViewController,
        params: NavParams
    ) {

    }

    /**
     * return success as false, no update required
     */
    cancel() {
        this.viewCtrl.dismiss({ success: false });
    }

    /**
     * return the updated data to the parent inorder
     * to update the store
     */
    saveItem() {
        let result = {
            success: true,
            ...this.item
        };
        this.viewCtrl.dismiss(result);
    }
}