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
      'phone_Number_mtn': "",
      'phone_Number_airtel': "",
      'phone_Number_tigo': "",
      'district': "",
      'province_name': "",
      'sector': "",
      'gender': "",
      'age': [null, Validators.compose([Validators.required, Validators.maxLength(2)])],
      'married': ""
    })
  }

  ngOnInit() {

    this.fbGetData();
    this.getCategories();
  }

  province_change() {
    console.log(this.province_name);
    if (this.province_name == 'Kigali') {
      this.districts = [
        'Gasabo', 'Nyarugenge', 'Kicukiro'
      ]
    } else if (this.province_name == 'Northern Province') {
      this.districts = [
        'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo', 'Nyabihu'
      ]
    } else if (this.province_name == 'Eastern Province') {
      this.districts = [
        'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'
      ]
    } else if (this.province_name == 'Western Province') {
      this.districts = [
        'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'
      ]
    } else {
      this.districts = [];
    }

  }

  district_change() {
    if (this.district_name == 'Bugesera') {
      this.sectors = [
        'Gashora', 'Juru', 'Kamabuye', 'Ntarama', 'Mareba', 'Mayange', 'Musenyi',
        'Mwogo', 'Ngeruka', 'Nyamata', 'Nyarugenge', 'Rilima', 'Ruhuha', 'Rweru', 'Shyara'
      ]
    } else if (this.district_name == 'Gatsibo') {
      this.sectors = [
        'Gasange', 'Gatsibo', 'Gitoki', 'Kaborore', 'Kageyo', 'Kiramuruzi', 'Kiziguro',
        'Muhura', 'Murambi', 'Ngarama', 'Nyagihanga', 'Remera', 'Rugarama', 'Rwimbogo'
      ]
    } else if (this.district_name == 'Kayonza') {
      this.sectors = [
        'Gahini', 'Kabare', 'Kabarondo', 'Mukarange', 'Murama', 'Murundi', 'Mwiri', 'Ndego',
        'Nyamirama', 'Rukara', 'Ruramira', 'Rwinkwavu'
      ]
    } else if (this.district_name == 'Burera') {
      this.sectors = [
        'Bungwe', 'Butaro', 'Cyanika', 'Cyeru', 'Gahunga', 'Gatebe', 'Gitovu', 'Kagogo', 'Kinoni',
        'Kinyababa', 'Kivuye', 'Nemba', 'Rugarama', 'Rugendabari', 'Ruhunde', 'Rusarabuge', 'Rwerere'
      ]
    } else if (this.district_name == 'Gakenke') {
      this.sectors = [
        'Busengo', 'Coko', 'Cyabingo', 'Gakenke', 'Gashenyi', 'Mugunga', 'Janja', 'Kamubuga', 'Karambo',
        'Kivuruga', 'Mataba', 'Minazi', 'Muhondo', 'Muyongwe', 'Muzo', 'Nemba', 'Ruli', 'Rusasa', 'Rushashi'
      ]
    } else if (this.district_name == 'Gicumbi') {
      this.sectors = [
        'Bukure', 'Bwisige', 'Byumba', 'Cyumba', 'Giti', 'Kaniga', 'Munyagiro', 'Miyove', 'Kageyo', 'Mukarange',
        'Muko', 'Mutete', 'Nyamiyaga', 'Nyankenke', 'Rubaya', 'Rukomo', 'Rushaki', 'Rutare', 'Ruvune', 'Rwamiko',
        'Shagasha'
      ]
    } else {
      this.sectors = [];
    }
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

      //check profile of the logged in user
      if (user.val().role == 'admin') {
        firebase.database().ref('/transporters/')
          .on('child_added', (snapshot, prevChildKey) => {
            transporters.push(snapshot.val());
            transporters_keys.push(snapshot.key);
            transporters_names.push(snapshot.val().first_name + ' ' + snapshot.val().last_name);
          })
      } else {
        firebase.database().ref('/transporters/')
          .orderByChild('collection_center')
          .equalTo(user.val().collection_center)
          .on('child_added', (snapshot, prevChildKey) => {
            transporters.push(snapshot.val());
            transporters_keys.push(snapshot.key);
            transporters_names.push(snapshot.val().first_name + ' ' + snapshot.val().last_name);
          })
      }



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
      var province = this.province_name
      var district = this.district_name
      var sector = this.sector_name
      var phone_number_mtn = this.transporter.phone_number_mtn
      var phone_number_airtel = this.transporter.phone_number_airtel
      var phone_number_tigo = this.transporter.phone_number_tigo
      var gender = this.transporter.gender
      var age = this.transporter.age
      var married = this.transporter.married
      var transporter_id = this.transporters.length + 1

      this.user = firebase.auth().currentUser;
      var uid = this.user.uid;

      firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
        this.user_collection_center = user.val().collection_center;

        firebase.database().ref('/transporters/').push(
          {
            first_name: first_name,
            last_name: last_name,
            collection_center: user.val().collection_center,
            collection_center_id: user.val().coll_gen_id,
            national_id: national_id,
            province: province,
            district: district,
            sector: sector,
            phone_number_mtn: phone_number_mtn,
            phone_number_airtel: phone_number_airtel,
            phone_number_tigo: phone_number_tigo,
            gender: gender,
            age: age,
            married: married,
            transporter_id: transporter_id
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
          province: this.province_name,
          district: this.district_name,
          sector: this.sector_name,
          phone_number_mtn: this.transporter.phone_number_mtn,
          phone_number_airtel: this.transporter.phone_number_airtel,
          phone_number_tigo: this.transporter.phone_number_tigo,
          gender: this.transporter.gender,
          age: this.transporter.age,
          married: this.transporter.married,
          transporter_id: this.transporters.length + 1,
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
    this.province_name = this.transporters[id].province;
    this.province_change();
    this.district_change();
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