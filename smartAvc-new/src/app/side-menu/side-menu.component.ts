import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service'

declare var firebase: any;
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  providers: [AuthService]
})
export class SideMenuComponent implements OnInit {

  user: any;
  account_type: any;
  admin = false;
  coll_admin = false;
  supervisor = false;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.user = firebase.auth().currentUser;
    var uid = this.user.uid;
    firebase.database().ref('/subscribers/' + uid).on('value', (user) => {

      this.account_type = user.val().role;
      if (this.account_type == 'admin') {
        this.admin = true;
      }
      if (this.account_type == 'coll_admin') {
        this.coll_admin = true;
      }

      if (this.account_type == 'supervisor') {
        this.supervisor = true;
      }
      // alert(JSON.stringify(this.me))
    })
  }

  logout(){
        this.auth.logout();
    }

}
