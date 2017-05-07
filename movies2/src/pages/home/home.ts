import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { MoviesPage } from '../movies/movies';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  theaters: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public af: AngularFire) {
    this.navCtrl = navCtrl;  
    this.theaters = af.database.list('/theaters');
  }

  next(n) {
    this.navCtrl.push(MoviesPage, { name: n });
  }

  login() {

  }

  logout(): void {
    window.localStorage.removeItem('user');

    this.navCtrl.setRoot(LoginPage);
  }

}
