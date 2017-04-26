import { Component, OnInit, EventEmitter } from '@angular/core';
import { Popup } from 'ng2-opd-popup';
import { Http } from '@angular/http';
import { AuthService } from '../shared/services/auth.service'

declare var firebase: any;
@Component({
    selector: 'profile-component',
    templateUrl: './profile.component.html',
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


export class ProfileComponent implements OnInit {
    user: any;
    admin = false;
    names:any;
    role: any;
    username: any;
    new_password: any;
    collection_center: any;
    uid: any;
    
    constructor(private auth: AuthService, public popup: Popup) {
        
    }

    ngOnInit() {
        
        this.getUserInfo();
    }

    getUserInfo() {
        this.user = firebase.auth().currentUser;
        this.uid = this.user.uid;

        firebase.database().ref('/subscribers/' + this.uid).on('value', (user) => {
            this.role = user.val().role;
            this.names = user.val().name;
            this.username = user.val().username;
            this.collection_center = user.val().collection_center;
        })
    }

    updatePassword(){
        this.user.updatePassword(this.new_password).then(
            ()=>{
                this.auth.logout()
            }
        )
    }
   
    update(){
        firebase.database().ref('/subscribers/' + this.uid).update({
            name: this.names
        })

        this.updatePassword()
    }

    trackByIndex(index: number, value: number) {
        return index;
    }

    showPopup(i) {
       
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

    

    logout() {
        this.auth.logout();
    }

}