import { Component, OnInit, EventEmitter } from '@angular/core';
import { md5 } from '../shared/ts/md5';
import { Coll } from '../shared/models/coll';
import { Popup } from 'ng2-opd-popup';
import { AuthService } from '../shared/services/auth.service'

declare var firebase: any;

@Component({
    selector: 'coll-component',
    templateUrl: './coll.component.html',
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

export class CollComponent implements OnInit {
    create_collection: boolean = false;
    update_collection: boolean = false;
    coll = new Coll();
    coll_id: any;
    updatingColl: boolean = false;
    province_name: string;
    district_name: string;
    sector_name: string;
    selectedColl: Coll;
    selected_coll: any;
    colls = [];
    colls_keys = [];
    districts = [];
    provinces = [
        'Kigali', 'Northern Province', 'Eastern Province', 'Western Province'
    ]
    sectors = []

    constructor(private auth: AuthService, public popup: Popup) { }
    ngOnInit() {
        this.fbGetData();
    }
    create() {
        this.create_collection = true;
    }
    cancelCreate() {
        this.create_collection = false;
        this.update_collection = false;
        this.coll = new Coll();
    }

    fbGetData() {

        this.colls = [];
        this.colls_keys = [];
        firebase.database().ref('/colls/').on('child_added', (snapshot, err) => {
            this.colls.push(snapshot.val());
            this.colls_keys.push(snapshot.key);
        })
        this.coll = new Coll();
    }

    fbPostData() {
        if (this.create_collection) {
            this.create_collection = false;
            firebase.database().ref('/colls/').push(
                {
                    name: this.coll.name,
                    manager_names: this.coll.manager_names,
                    manager_username: this.coll.manager_username,
                    manager_contact: this.coll.manager_contact,
                    supervisor_names: this.coll.supervisor_names,
                    supervisor_username: this.coll.supervisor_username,
                    supervisor_contact: this.coll.supervisor_contact,
                    province: this.province_name,
                    district: this.district_name,
                    sector: this.sector_name,
                    generated_id: md5(this.coll.name),
                    date_created: Date.now(),
                    stock: 0
                });
            var username = this.coll.manager_username;
            var coll_name = this.coll.name;
            var name = this.coll.manager_names;
            var supervisor_name = this.coll.supervisor_names;
            var supervisor_username = this.coll.supervisor_username;
            firebase.auth().createUserWithEmailAndPassword(this.coll.manager_username + '@smartavc.com', 'password')
                .then(

                (user) => {

                    firebase.database().ref('/subscribers/' + user.uid).set({
                        name: name,
                        collection_center: coll_name,
                        coll_gen_id: md5(coll_name),
                        username: username,
                        role: 'coll_admin'
                    })
                })

            firebase.auth().createUserWithEmailAndPassword(this.coll.supervisor_username + '@smartavc.com', 'password')
                .then(

                (user) => {

                    firebase.database().ref('/subscribers/' + user.uid).set({
                        name: supervisor_name,
                        collection_center: coll_name,
                        coll_gen_id: md5(coll_name),
                        username: supervisor_username,
                        role: 'supervisor'
                    })
                })
        }

        if (this.update_collection) {
            this.update_collection = false;
            var postData = {
                name: this.coll.name,
                manager_names: this.coll.manager_names,
                manager_username: this.coll.manager_username,
                manager_contact: this.coll.manager_contact,
                supervisor_names: this.coll.supervisor_names,
                supervisor_username: this.coll.supervisor_username,
                supervisor_contact: this.coll.supervisor_contact,
                province: this.province_name,
                district: this.district_name,
                sector: this.sector_name,
                date_created: this.coll.date_created,
                stock: 0,
                coll_id: this.colls.length + 1

            }
            firebase.database().ref('/colls/' + this.colls_keys[this.coll_id]).update(postData);
            this.coll = new Coll();
        }



        this.fbGetData();
    }

    fbDeleteData(id) {

        firebase.database().ref('/colls/' + this.colls_keys[id]).remove();
        this.fbGetData();
    }

    fbGetSinglecoll(id) {
        var selectedColl: Coll;
        firebase.database().ref('/colls/').orderByChild("coll_id").equalTo(id).on("child_added", function (snapshot) {
            selectedColl = snapshot.val();

            console.log(selectedColl);
        });
        this.selectedColl = selectedColl;
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


    updateColl(id) {
        this.update_collection = true;
        this.coll = this.colls[id];
        this.province_name = this.coll.province;
        this.province_change();
        this.district_change();
        this.coll_id = id;
    }

    showPopup(i) {
        this.selected_coll = i;
        this.popup.options = {
            header: "Deleting a Center",
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
        var id = this.selected_coll;
        var coll_id = this.colls_keys[id];
        firebase.database().ref('/colls/' + coll_id).once('value').then(
            (snapshot) => {
                var gen_id = snapshot.val().generated_id;
                console.log(gen_id)
                firebase.database().ref('/subscribers/')
                    .orderByChild('coll_gen_id')
                    .equalTo(gen_id).on('child_added', (snapshot) => {
                        firebase.database().ref('/subscribers/' + snapshot.key).remove();
                    })
            }
        )

        firebase.database().ref('/colls/' + coll_id).remove();

        this.popup.hide();
        this.fbGetData();
    }

    trackByIndex(index: number, value: number) {
        return index;
    }
}