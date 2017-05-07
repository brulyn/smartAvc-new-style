import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import * as firebase from 'firebase';
/*
  Generated class for the ViewMovie page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-view-movie',
  templateUrl: 'view-movie.html'
})
export class ViewMoviePage {
  myDate: String;
  myTime: any = '15:15';
  movie: any;
  name: string;
  key: string;
  description: string;
  time_weekdays : any[];
  time_weekends: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var today: any = new Date();
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    this.myDate = yyyy + '-' + mm + '-' + dd
  }


  ionViewDidLoad() {
    this.movie = this.navParams.get('movie');
    this.name = this.movie.name;
    this.description = this.movie.description;

    firebase.database().ref('/movies')
    .orderByChild('name')
    .equalTo(this.name)
    .on('child_added',(m) =>{
      let t_weekdays = [];
      this.key = m.key
      firebase.database().ref('/movies/'+ m.key +'/weekdays/').on('value', (t)=>{
        t.forEach(function(t){
          t_weekdays.push(t.val());
          return false
        });
      })
      this.time_weekdays = t_weekdays
    })
  }

  date_submit() {
    
    let user = NativeStorage.getItem('user').then(
      user => {
        alert(JSON.stringify(user))
      }
    );

  }

}
