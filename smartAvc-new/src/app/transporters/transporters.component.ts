import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Popup } from 'ng2-opd-popup';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Transporter } from '../shared/models/transporter';
import { AuthService } from '../shared/services/auth.service'
//import { TransporterService } from '../shared/services/Transporter.service';

declare var firebase: any;

@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
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

export class TransportersComponent implements OnInit {
  user: any;
  user_collection_center: any;
  selected_transporter: any;
  previous_stock: number;
  stock: number;
  category_name: string;
  subcategory_name: string;
  updatingStock = false;
  selectedTransporter: Transporter;
  transporters = [];
  transporters_keys = [];
  transporters_names = [];
  transporter = new Transporter();
  transporter_id: any;
  create_transporter = false;
  update_transporter = false;
  province_name = "";
  district_name = "";
  sector_name = "";
  districts = [];
  sectors = [];
  categories = [];
  category_keys = [];
  provinces = [
    'Kigali', 'Northern Province', 'Eastern Province', 'Western Province'
  ]

  transporterForm: FormGroup;

  constructor(private auth: AuthService, fb: FormBuilder, public popup: Popup) {
    this.transporterForm = fb.group({
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'national_id': [null, Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(16)])],
      'phone_number': "",
      'gender': "",
      'age': [null, Validators.compose([Validators.required, Validators.maxLength(2)])],
      'vehicle_type': [null, Validators.required],
      'plate_number': [null, Validators.required]
    })
  }

  ngOnInit() {

    this.fbGetData();
    this.getCategories();
  }

  onSubmit() {
    this.create_transporter = false;

    // console.log(JSON.stringify(this.transporter));

    // this.transporter = new transporter();
    this.fbGetData();
  }

  create() {
    this.create_transporter = true;
  }

  cancelCreate() {
    this.create_transporter = false;
    this.update_transporter = false;
    this.transporter = new Transporter();
  }

  done_creating_transporter() {

  }


  fbGetData() {

    var transporters = [];
    var transporters_keys = [];
    var transporters_names = this.transporters_names;
    this.user = firebase.auth().currentUser;
    var uid = this.user.uid;

    firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
      this.user_collection_center = user.val().collection_center;

      firebase.database().ref('/transporters/')
        .on('child_added', (snapshot, prevChildKey) => {
          transporters.push(snapshot.val());
          transporters_keys.push(snapshot.key);
          transporters_names.push(snapshot.val().first_name + ' ' + snapshot.val().last_name);
        })

      this.transporters = transporters;
      this.transporters_keys = transporters_keys;
      this.transporters_names = transporters_names;
    })

    this.transporter = new Transporter();
  }

  fbPostData() {

    if (this.create_transporter) {

      this.create_transporter = false;

      var first_name = this.transporter.first_name
      var last_name = this.transporter.last_name
      var national_id = this.transporter.national_id
      var phone_number = this.transporter.phone_number
      var gender = this.transporter.gender
      var age = this.transporter.age
      var vehicle_type = this.transporter.vehicle_type
      var plate_number = this.transporter.plate_number

      this.user = firebase.auth().currentUser;
      var uid = this.user.uid;

      firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
        this.user_collection_center = user.val().collection_center;

        firebase.database().ref('/transporters/').push(
          {
            first_name: first_name,
            last_name: last_name,
            national_id: national_id,
            phone_number: phone_number,
            gender: gender,
            age: age,
            vehicle_type: vehicle_type,
            plate_number: plate_number
          });
      })
    }
    if (this.update_transporter) {
      this.update_transporter = false;
      firebase.database().ref('/transporters/' + this.transporters_keys[this.transporter_id]).set(
        {
          first_name: this.transporter.first_name,
          last_name: this.transporter.last_name,
          national_id: this.transporter.national_id,
          phone_number: this.transporter.phone_number,
          gender: this.transporter.gender,
          age: this.transporter.age,
          vehicle_type: this.transporter.vehicle_type,
          plate_number: this.transporter.plate_number
        }
      )
    }

    this.fbGetData();
  }

  fbDeleteData(id) {

    firebase.database().ref('/transporters/' + this.transporters_keys[id]).remove();

    this.fbGetData();
  }

  showPopup(i) {
    this.selected_transporter = i;
    this.popup.options = {
      header: "Deleting a transporter",
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
    var id = this.selected_transporter;
    firebase.database().ref('/transporters/' + this.transporters_keys[id]).remove();
    this.popup.hide();
    this.fbGetData();
  }

  fbGetSingleTransporter(id) {
    var selectedTransporter: Transporter;
    firebase.database().ref('/transporters/').orderByChild("transporter_id").equalTo(id).on("child_added", function (snapshot) {
      selectedTransporter = snapshot.val();

      console.log(selectedTransporter);
    });
    this.selectedTransporter = selectedTransporter;
  }

  fbUpdateData(id) {
    this.update_transporter = true;
    this.transporter = this.transporters[id];
    this.transporter_id = id;
  }

  updateStock(id) {
    this.updatingStock = true;

    var postData = {
      updating_stock: true
    }

    firebase.database().ref('/transporters/' + this.transporters_keys[id]).update(postData)
    // firebase.database().ref('/transporters/').orderByChild("transporter_id").equalTo(id).on("child_added", function (snapshot) {
    //     firebase.database().ref('/transporters/' + snapshot.key).update(postData)
    // });

    // this.fbGetSingletransporter(id);
    // this.previous_stock = this.selectedtransporter.stock;
    this.fbGetData();
    console.log(JSON.stringify(this.transporter));
  }

  cancelUpdate(id) {
    var postData = {
      updating_stock: false
    }

    firebase.database().ref('/transporters/' + this.transporters_keys[id]).update(postData)

    this.fbGetData();
  }

  add(x: number, y: number): number {
    return x + y;
  }

  getCategories() {
    var c = [];
    var category_keys = [];
    firebase.database().ref('/categories/').on('child_added', function (snapshot) {
      c.push(snapshot.val());
      category_keys.push(snapshot.key)
    })
    this.categories = c;
    this.category_keys = category_keys
  }

  getUserInfo() {
    this.user = firebase.auth().currentUser;
    var uid = this.user.uid;

    firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
      this.user_collection_center = user.val().collection_center;
    })
  }

  updateDone(id) {

    this.updatingStock = false;
    var new_stock: number = this.stock;
    var category_name = this.category_name;
    var subcategory_name = this.subcategory_name;

    this.user = firebase.auth().currentUser;
    var uid = this.user.uid;
    var postData: any;
    firebase.database().ref('/subscribers/' + uid).on('value', (snapshot) => {
      this.user_collection_center = snapshot.val().collection_center;
      postData = {
        stock: new_stock,
        updating_stock: false,
        date_deposit: Date.now(),
        category: this.category_name,
        collection_center: this.user_collection_center,
        subcategory: this.subcategory_name
      }

      firebase.database().ref('/transporters/' + this.transporters_keys[id]).update(postData);

    })



    this.fbGetData();
    this.stock = 0;
  }

  trackByIndex(index: number, value: number) {
    return index;
  }

  logout() {
    this.auth.logout();
  }

}