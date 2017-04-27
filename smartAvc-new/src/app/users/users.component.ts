import { Component, OnInit } from '@angular/core';
import { Popup } from 'ng2-opd-popup';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { User } from '../shared/models/user';
import { AuthService } from '../shared/services/auth.service'

declare var firebase: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
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

export class UsersComponent implements OnInit {
  subscriber: any;
  user_collection_center: any;
  selected_user: any;
  category_name: string;
  collection_centers = [];
  coll_gen_ids = [];
  selectedUser: User;
  users = [];
  users_keys = [];
  users_names = [];
  user = new User();
  user_id: any;
  create_user = false;
  update_user = false;
  account: any;
  userForm: FormGroup;

  constructor(private auth: AuthService, fb: FormBuilder, public popup: Popup) {
    this.userForm = fb.group({
      'name': [null, Validators.required],
      'username': [null, Validators.required],
      'collection_center': "",
      'role': "",
      'phone_number': "",
      'gender': ""
    })
  }

  ngOnInit() {

    this.fbGetData();
  }

  onSubmit() {
    this.create_user = false;

    // console.log(JSON.stringify(this.user));

    // this.user = new User();
    this.fbGetData();
  }

  create() {
    this.create_user = true;
  }

  cancelCreate() {
    this.create_user = false;
    this.update_user = false;
    this.user = new User();
  }

  done_creating_user() {

  }


  fbGetData() {
    var users = [];
    var users_keys = [];
    var users_names = this.users_names;
    var collection_centers = [];
    this.subscriber = firebase.auth().currentUser;
    var uid = this.subscriber.uid;
    firebase.database().ref('/subscribers/')
      .on('child_added', (snapshot, prevChildKey) => {
        if (snapshot.val().role !== 'admin') {
          users.push(snapshot.val());
          users_keys.push(snapshot.key);
          users_names.push(snapshot.val().name + ' ' + snapshot.val().username);
        }
      })
    firebase.database().ref('/colls/')
      .on('child_added', (snapshot) => {
        collection_centers.push(snapshot.val());
      })
    this.users = users;
    this.users_keys = users_keys;
    this.users_names = users_names;
    this.collection_centers = collection_centers;
    this.user = new User();
  }

  fbPostData() {
    var name = this.user.name;
    var username = this.user.username;
    var collection_center = this.user.collection_center;
    var account_type = this.user.role;
    var phone_number = this.user.phone_number;
    var gender = this.user.gender;
    if (this.create_user) {
      this.create_user = false;
      firebase.auth()
        .createUserWithEmailAndPassword(this.user.username + '@smartavc.com', 'password')
        .then((u) => {
          firebase.database().ref('/subscribers/' + u.uid).set(
            {
              name: name,
              username: username,
              collection_center: collection_center,
              role: account_type,
              phone_number: phone_number  ,
              gender: gender
            });
        })
    }
    if (this.update_user) {
      this.update_user = false;
      firebase.database().ref('/subscribers/' + this.users_keys[this.user_id]).set(
        {
          name: name,
          username: username,
          collection_center: collection_center,
          role: account_type,
          phone_number_mtn: phone_number,
          gender: gender
        }
      )
    }

    this.fbGetData();
  }

  fbDeleteData(id) {

    firebase.database().ref('/subscribers/' + this.users_keys[id]).remove();

    this.fbGetData();
  }

  showPopup(i) {
    this.selected_user = i;
    this.popup.options = {
      header: "Deleting a user",
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
    var id = this.selected_user;
    firebase.database().ref('/subscribers/' + this.users_keys[id]).remove();
    this.popup.hide();
    this.fbGetData();
  }

  fbGetSingleUser(id) {
    var selectedUser: User;
    firebase.database().ref('/subscribers/').orderByChild("user_id").equalTo(id).on("child_added", function (snapshot) {
      selectedUser = snapshot.val();

      console.log(selectedUser);
    });
    this.selectedUser = selectedUser;
  }

  fbUpdateData(id) {
    this.update_user = true;
    this.user = this.users[id];
    this.user_id = id;
  }



  getUserInfo() {
    this.subscriber = firebase.auth().currentUser;
    var uid = this.subscriber.uid;

    firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
      this.user_collection_center = user.val().collection_center;
    })
  }


  trackByIndex(index: number, value: number) {
    return index;
  }

  logout() {
    this.auth.logout();
  }

}
