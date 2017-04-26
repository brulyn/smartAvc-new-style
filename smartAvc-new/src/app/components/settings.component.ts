import { Component, OnInit, EventEmitter } from '@angular/core';
import { Popup } from 'ng2-opd-popup';
import { Http } from '@angular/http';
import { AuthService } from '../shared/services/auth.service'

declare var firebase: any;
@Component({
    selector: 'settings-component',
    templateUrl: './settings.component.html',
    styles: [
        `
        i {
            cursor: pointer;
            font-size: 15px;
            padding-left: 10px;
        }
        `
    ],
    providers: [AuthService]
})


export class SettingsComponent implements OnInit {
    user: any;
    admin = false;
    categories = [];
    categories_cost = [];
    category_keys = [];
    subcategories = [];
    subcategory_keys = [];
    category_name = "";
    subcategory_name = "";
    selected_cat: any;
    new_category_name = "";
    cost = 0;

    add_trigger = false;
    constructor(private auth: AuthService, public popup: Popup) {
        this.getCategories();
    }

    ngOnInit() {
        this.getCategories();
        this.getUserInfo();
    }

    getUserInfo() {
        this.user = firebase.auth().currentUser;
        var uid = this.user.uid;

        firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
            if (user.val().role == 'admin') {
                this.admin = true;
            }
        })
    }

    changeCost() {
        var c = this.cost;
        var n = this.category_name;
        var s = this.subcategory_name;

        var ref = firebase.database().ref('/categories_cost/');
        ref.orderByChild('type').equalTo(this.category_name).on('child_added', function (snapshot) {
            if (snapshot.val().category == s) {
                firebase.database().ref('/categories_cost/' + snapshot.key).update({
                    cost: c
                })
            }
        })

        this.cost = 0;
        this.getCategories();

    }

    getCategories() {
        var c = [];
        var category_keys = [];
        var s = [];
        var subcategory_keys = [];
        firebase.database().ref('/categories/').on('child_added', function (snapshot) {
            c.push(snapshot.val());
            category_keys.push(snapshot.key)
        })

        firebase.database().ref('/categories_cost/').on('child_added', function (snapshot) {
            s.push(snapshot.val());
            subcategory_keys.push(snapshot.key)
        })
        this.categories = c;
        this.category_keys = category_keys;
        this.subcategories = s;
        this.subcategory_keys = subcategory_keys;
    }

    deleteCategory(id) {
        var name;
        firebase.database().ref('/categories/' + this.category_keys[id]).on('value', (snapshot) => {
            name = snapshot.val().name;
            firebase.database().ref('/categories_cost')
                .orderByChild('type')
                .equalTo(name)
                .on('child_added', (snap) => {
                    if (snap.val().type == name) {
                        firebase.database().ref('/categories_cost/' + snap.key).remove()
                    }
                })
        })

        firebase.database().ref('/categories/' + this.category_keys[id])
            .remove();
        this.category_name = "";
        this.subcategory_name = "";
        this.new_category_name = ""
        this.getCategories();
    }

    trackByIndex(index: number, value: number) {
        return index;
    }

    add() {
        this.add_trigger = true;
    }

    addCategory() {
        firebase.database().ref('/categories/').push({
            'name': this.new_category_name,
            'cost': 0
        })

        var cat = ['A', 'B', 'C', 'D', 'E'];

        for (let i = 0; i < cat.length; i++) {
            firebase.database().ref('/categories_cost/').push({
                'type': this.new_category_name,
                'category': cat[i],
                'cost': 0

            })
        }

        this.new_category_name = "";
        this.add_trigger = false;
        this.getCategories();
    }

    showPopup(i) {
        this.selected_cat = i;
        this.popup.options = {
            header: "Deleting a Type",
            color: "#B54848", // red, blue.... 
            widthProsentage: 40, // The with of the popou measured by browser width 
            animationDuration: 1, // in seconds, 0 = no animation 
            showButtons: true, // You can hide this in case you want to use custom buttons 
            confirmBtnContent: "Delete", // The text on your confirm button 
            cancleBtnContent: "Cancel", // the text on your cancel button 
            confirmBtnClass: "btn btn-danger", // your class for styling the confirm button 
            cancleBtnClass: "btn btn-default", // you class for styling the cancel button 
            animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
        };

        this.popup.show(this.popup.options);
    }

    confirmDelete() {
        var id = this.selected_cat;
        var cat_id = this.category_keys[id];
        var name = "";
        firebase.database().ref('/categories/' + cat_id).on('value', (snapshot) => {
            name = snapshot.val().name;
            firebase.database().ref('/categories_cost')
                .on('child_added', (snap) => {
                    if (snap.val().type == name) {
                        firebase.database().ref('/categories_cost/' + snap.key).remove()
                    }
                })
            firebase.database()
                .ref('/categories/' + cat_id)
                .remove();
        })


        this.popup.hide();
        this.getCategories();
    }

    logout() {
        this.auth.logout();
    }

}