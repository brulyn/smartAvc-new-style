import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Popup } from 'ng2-opd-popup';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Farmer } from '../shared/models/farmer';
import { AuthService } from '../shared/services/auth.service'
//import { FarmerService } from '../shared/services/farmer.service';

declare var firebase: any;

@Component({
    selector: 'farmers-component',
    templateUrl: './farmers.component.html',
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

export class FarmersComponent implements OnInit {
    loaded = false;
    user: any;
    admin = false;
    user_collection_center: any;
    selected_farmer: any;
    previous_stock: number;
    stock: number;
    category_name: string;
    subcategory_name: string;
    updatingStock = false;
    selectedFarmer: Farmer;
    farmers = [];
    farmers_keys = [];
    farmers_names = [];
    farmer = new Farmer();
    farmer_id: any;
    create_farmer = false;
    update_farmer = false;
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

    farmerForm: FormGroup;

    constructor(private auth: AuthService, fb: FormBuilder, public popup: Popup) {
        this.farmerForm = fb.group({
            'first_name': [null, Validators.required],
            'last_name': [null, Validators.required],
            'national_id': [null, Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(16)])],
            'phone_Number_mtn': "",
            'phone_Number_airtel': "",
            'phone_Number_tigo': "",
            'farm_width': [null, Validators.required],
            'district': "",
            'province_name': "",
            'sector': "",
            'gender': "",
            'age': [null, Validators.compose([Validators.required, Validators.maxLength(2)])],
            'married': ""
        })
    }

    ngOnInit() {
        this.getUserInfo();
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
        this.create_farmer = false;

        // console.log(JSON.stringify(this.farmer));

        // this.farmer = new Farmer();
        this.fbGetData();
    }

    create() {
        this.create_farmer = true;
    }

    cancelCreate() {
        this.create_farmer = false;
        this.update_farmer = false;
        this.farmer = new Farmer();
    }

    done_creating_farmer() {

    }


    fbGetData() {

        var farmers = [];
        var farmers_keys = [];
        var farmers_names = this.farmers_names;
        this.user = firebase.auth().currentUser;
        var uid = this.user.uid;

        firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
            this.user_collection_center = user.val().collection_center;

            //check profile of the logged in user
            if (user.val().role == 'admin') {
                firebase.database().ref('/farmers/')
                    .on('child_added', (snapshot, prevChildKey) => {
                        farmers.push(snapshot.val());
                        farmers_keys.push(snapshot.key);
                        farmers_names.push(snapshot.val().first_name + ' ' + snapshot.val().last_name);
                    })
            } else {
                firebase.database().ref('/farmers/')
                    .orderByChild('collection_center')
                    .equalTo(user.val().collection_center)
                    .on('child_added', (snapshot, prevChildKey) => {
                        farmers.push(snapshot.val());
                        farmers_keys.push(snapshot.key);
                        farmers_names.push(snapshot.val().first_name + ' ' + snapshot.val().last_name);
                    })
            }



            this.farmers = farmers;
            this.farmers_keys = farmers_keys;
            this.farmers_names = farmers_names;
        })

        this.farmer = new Farmer();
    }

    fbPostData() {

        if (this.create_farmer) {

            this.create_farmer = false;

            var first_name = this.farmer.first_name
            var last_name = this.farmer.last_name
            var national_id = this.farmer.national_id
            var province = this.province_name
            var district = this.district_name
            var sector = this.sector_name
            var phone_number_mtn = this.farmer.phone_number_mtn
            var phone_number_airtel = this.farmer.phone_number_airtel
            var phone_number_tigo = this.farmer.phone_number_tigo
            var gender = this.farmer.gender
            var age = this.farmer.age
            var married = this.farmer.married
            var farm_width = this.farmer.farm_width
            var farmer_id = this.farmers.length + 1

            this.user = firebase.auth().currentUser;
            var uid = this.user.uid;

            firebase.database().ref('/subscribers/' + uid).on('value', (user) => {
                this.user_collection_center = user.val().collection_center;

                firebase.database().ref('/farmers/').push(
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
                        farm_width: farm_width,
                        date_deposit: Date.now(),
                        stock: 0,
                        farmer_id: farmer_id,
                        category: ''
                    });
            })
        }
        if (this.update_farmer) {
            this.update_farmer = false;
            firebase.database().ref('/farmers/' + this.farmers_keys[this.farmer_id]).set(
                {
                    first_name: this.farmer.first_name,
                    last_name: this.farmer.last_name,
                    national_id: this.farmer.national_id,
                    province: this.province_name,
                    district: this.district_name,
                    sector: this.sector_name,
                    phone_number_mtn: this.farmer.phone_number_mtn,
                    phone_number_airtel: this.farmer.phone_number_airtel,
                    phone_number_tigo: this.farmer.phone_number_tigo,
                    gender: this.farmer.gender,
                    age: this.farmer.age,
                    married: this.farmer.married,
                    farm_width: this.farmer.farm_width,
                    date_deposit: this.farmer.date_deposit,
                    stock: this.farmer.stock,
                    farmer_id: this.farmers.length + 1,
                    category: this.farmer.category
                }
            )
        }

        this.fbGetData();
    }

    fbDeleteData(id) {

        firebase.database().ref('/farmers/' + this.farmers_keys[id]).remove();

        this.fbGetData();
    }

    showPopup(i) {
        this.selected_farmer = i;
        this.popup.options = {
            header: "Deleting a Farmer",
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
        var id = this.selected_farmer;
        firebase.database().ref('/farmers/' + this.farmers_keys[id]).remove();
        this.popup.hide();
        this.fbGetData();
    }

    fbGetSingleFarmer(id) {
        var selectedFarmer: Farmer;
        firebase.database().ref('/farmers/').orderByChild("farmer_id").equalTo(id).on("child_added", function (snapshot) {
            selectedFarmer = snapshot.val();

            console.log(selectedFarmer);
        });
        this.selectedFarmer = selectedFarmer;
    }

    fbUpdateData(id) {
        this.update_farmer = true;
        this.farmer = this.farmers[id];
        this.farmer_id = id;
        this.province_name = this.farmers[id].province;
        this.province_change();
        this.district_change();
    }

    updateStock(id) {
        this.updatingStock = true;

        var postData = {
            updating_stock: true
        }

        firebase.database().ref('/farmers/' + this.farmers_keys[id]).update(postData)
        // firebase.database().ref('/farmers/').orderByChild("farmer_id").equalTo(id).on("child_added", function (snapshot) {
        //     firebase.database().ref('/farmers/' + snapshot.key).update(postData)
        // });

        // this.fbGetSingleFarmer(id);
        // this.previous_stock = this.selectedFarmer.stock;
        this.fbGetData();
        console.log(JSON.stringify(this.farmer));
    }

    cancelUpdate(id) {
        var postData = {
            updating_stock: false
        }

        firebase.database().ref('/farmers/' + this.farmers_keys[id]).update(postData)

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
            if(user.val().role == 'admin'){
                this.admin = true;
            }

            this.loaded = true
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

            firebase.database().ref('/farmers/' + this.farmers_keys[id]).update(postData);

            firebase.database().ref('/stock/').push({
                farmer_id: this.farmers_keys[id],
                farmer_names: this.farmers_names[id],
                collection_center: snapshot.val().collection_center,
                stock: this.stock,
                date: Date.now(),
                category: this.category_name,
                subcategory: this.subcategory_name,
                status: 'pending',
                pending: true,
                approved: false,
            })
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