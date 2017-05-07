import { Component } from '@angular/core';
import { AuthProviders, AuthMethods } from 'angularfire2';
import { NavController, Platform, ViewController } from 'ionic-angular';
import { Oauth } from "ng2-cordova-oauth/core";
import { Facebook, GooglePlus, NativeStorage } from 'ionic-native';
import { HomePage } from '../home/home';
import { MoviesPage } from '../movies/movies';
import * as firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  FB_APP_ID: number = 1786545721609338

  public oauth: Oauth;
  private provider: Facebook;
  user: any;

  constructor(public platform: Platform, public navCtrl: NavController, public view: ViewController) {
    this.navCtrl = navCtrl;
    this.oauth = new Oauth();
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
    // this.provider = new Facebook({
    //   clientId: "CLIENT_ID_HERE",
    //   appScope: ["email"]
    // });

  }

  // public login() {
  //   this.platform.ready().then(() => {
  //     this.oauth.logInVia(this.provider).then((success) => {
  //       alert(JSON.stringify(success));
  //     }, (error) => {
  //       console.log(JSON.stringify(error));
  //     });
  //   });
  // }

  doFbLogin() {
    let permissions = new Array();
    let index = this.view.index;
    let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];
    
    Facebook.login(permissions)
      .then(function (response) {
        let userId = response.authResponse.userID;
        let params = new Array();

        //Getting name and gender properties
        Facebook.api("/me?fields=name,gender", params)
          .then(function (user) {
            let env = this;
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            //now we have the users info, let's save it in the NativeStorage
            NativeStorage.setItem('user',
              {
                name: user.name,
                gender: user.gender,
                picture: user.picture
              })
              .then(function () {
                firebase.database().ref('subscribers/'+userId).set({
                  username: user.name
                })
                nav.push(MoviesPage);
                nav.remove(index)
              }, function (error) {
                console.log(error);
              })
          })
      }, function (error) {
        console.log(error);
      });
  }


}
