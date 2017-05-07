import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { Facebook, GooglePlus, NativeStorage } from 'ionic-native';

import { Movie } from '../../shared/movie';
import { LoginPage } from '../login/login';
import { ViewMoviePage } from '../view-movie/view-movie'

export const firebaseConfig = {
  apiKey: "AIzaSyCkbUXWg2YvVUaMWSw-RfeIlLSCJ27n3ak",
  authDomain: "movies-85a7a.firebaseapp.com",
  databaseURL: "https://movies-85a7a.firebaseio.com",
  storageBucket: "movies-85a7a.appspot.com",
  messagingSenderId: "917824881969"
};
firebase.initializeApp(firebaseConfig)

@Component({
  selector: 'page-movies',
  templateUrl: 'movies.html'
})
export class MoviesPage {
  //firebase:any;
  FB_APP_ID: number = 1786545721609338
  mo: string = "now_showing";
  movies: any;
  showing: any[] = [];
  soon: any[] = [];
  database = firebase.database();
  movies_test: any;

  constructor(public navCtrl: NavController, public view: ViewController, public http: Http, public navParams: NavParams, public loadingCtrl: LoadingController) {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    Facebook.browserInit(this.FB_APP_ID, "v2.8");

    loader.present();
    this.database.ref('/movies')
      .orderByChild('theater_category')
      .equalTo('Century Cinema_now_showing')
      .on('child_added', (data) => {
        this.showing.push({
          name: data.val().name,
          image_url: data.val().image_url,
          description: data.val().description
        })
      })
    this.database.ref('/movies')
      .orderByChild('theater_category')
      .equalTo('Century Cinema_coming_soon')
      .on('child_added', (data) => {

        this.soon.push({
          name: data.val().name,
          image_url: data.val().image_url,
          description: data.val().description
        })
        loader.dismiss();
      })

    //this.soon.subscribe((done)=> loader.dismiss());

  }

  name = 'Century Cinema'
  bookSeat() {

  }

  doFbLogout() {
    var nav = this.navCtrl;
    let index = this.view.index;
    Facebook.logout()
      .then(function (response) {
        //user logged out so we will remove him from the NativeStorage
        NativeStorage.remove('user');
        nav.push(LoginPage);
        nav.remove(index);
      }, function (error) {
        console.log(error);
      });
  }

  clicked(m) {
    this.navCtrl.push(ViewMoviePage, { movie: m});
  }
}
