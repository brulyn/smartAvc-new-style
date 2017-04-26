import { Component, OnInit, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Farmer } from '../shared/models/farmer';
import { AuthService } from '../shared/services/auth.service'
//import { FarmerService } from '../shared/services/farmer.service';

declare var firebase: any;

@Component({
    selector: 'stock-component',
    templateUrl: './stock.component.html',
    styles: [
        `
        i {
            cursor: pointer;
            font-size: 20px;
            padding-left: 10px;
        }
        `
    ],
    providers: [AuthService]
})

export class StockComponent implements OnInit {

    stocks = []
    stocks_keys = [];
    stocks_dates = [];
    user: any;
    user_collection_center: any;
    supervisor = false;
    constructor(private auth: AuthService, fb: FormBuilder) { }

    ngOnInit() {
        this.fbGetData();
    }

    fbGetData() {
        var stocks = [];
        var stocks_keys = [];
        var stocks_dates = [];

        this.user = firebase.auth().currentUser;
        var uid = this.user.uid;

        firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
            this.user_collection_center = user.val().collection_center;
            //get if the user is a supervisor
            if (user.val().role == 'supervisor') {
                this.supervisor = true;
                firebase.database().ref('/stock/')
                    .orderByChild('collection_center')
                    .equalTo(user.val().collection_center)
                    .on('child_added', (snapshot, prevChildKey) => {

                        stocks.push(snapshot.val());
                        stocks_keys.push(snapshot.key);
                        //getting the date format from the timestamp
                        var day = new Date(snapshot.val().date).getDate();
                        var month = new Date(snapshot.val().date).getMonth();
                        var year = new Date(snapshot.val().date).getFullYear();
                        var full_date = day + '/' + month + '/' + year

                        stocks_dates.push(full_date);


                    })

                this.stocks = stocks;
                this.stocks_keys = stocks_keys;
                this.stocks_dates = stocks_dates;
            }
            if (user.val().role == 'admin') {
                firebase.database().ref('/stock/').on('child_added', (snapshot, prevChildKey) => {
                    stocks.push(snapshot.val());
                    stocks_keys.push(snapshot.key);
                    //getting the date format from the timestamp
                    var day = new Date(snapshot.val().date).getDate();
                    var month = new Date(snapshot.val().date).getMonth();
                    var year = new Date(snapshot.val().date).getFullYear();
                    var full_date = day + '/' + month + '/' + year

                    stocks_dates.push(full_date);

                })

                this.stocks = stocks;
                this.stocks_keys = stocks_keys;
                this.stocks_dates = stocks_dates;
            }

            if (user.val().role == 'coll_admin') {

                firebase.database().ref('/stock/')
                    .orderByChild('collection_center')
                    .equalTo(user.val().collection_center)
                    .on('child_added', (snapshot, prevChildKey) => {
                        if (snapshot.val().status == 'Approved') {
                            stocks.push(snapshot.val());
                            stocks_keys.push(snapshot.key);
                            //getting the date format from the timestamp
                            var day = new Date(snapshot.val().date).getDate();
                            var month = new Date(snapshot.val().date).getMonth();
                            var year = new Date(snapshot.val().date).getFullYear();
                            var full_date = day + '/' + month + '/' + year

                            stocks_dates.push(full_date);
                        }

                    })

                this.stocks = stocks;
                this.stocks_keys = stocks_keys;
                this.stocks_dates = stocks_dates;
            }
        })


        //this.stocks = new Farmer();
    }

    approve(id) {
        firebase.database().ref('/stock/' + this.stocks_keys[id]).update({
            status: 'Approved',
            pending: false,
            approved: true
        })
        this.fbGetData();
    }

    trackByIndex(index: number, value: number) {
        return index;
    }

    logout() {
        this.auth.logout();
    }

}