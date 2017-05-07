import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
//import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MoviesPage } from '../pages/movies/movies';
import { Facebook, GooglePlus, NativeStorage, Splashscreen, StatusBar } from 'ionic-native';

@Component({
  templateUrl: 'app.html'
})
export class MyApp{
  rootPage: any;
  
  constructor(platform: Platform) {

	platform.ready().then(() => {
      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app
      let env = this;
      NativeStorage.getItem('user')
      .then( function (data) {
        // user is previously logged and we have his data
        // we will let him access the app
        env.rootPage = MoviesPage
        Splashscreen.hide();
      }, function (error) {
        //we don't have the user data so we will ask him to log in
        env.rootPage = MoviesPage
        Splashscreen.hide();
      });

      StatusBar.styleDefault();
    });
  }

}
