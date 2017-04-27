import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styles: [`
        .login-form{
            position: relative;
            z-index: 999;
            overflow: show;
            margin: auto;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }
        
    `],
    providers: [AuthService]
})

export class LoginComponent implements OnInit {
    error: any;
    errorMessage: any;
    sub: any;
    wait = false;

    constructor(private auth: AuthService, private route: ActivatedRoute) {

    }

    ngOnInit() {


        this.sub = this.route.params.subscribe(params => {
            this.errorMessage = params['message'];
        });

    }
    login(f) {

        this.auth.signinUser(f.value);

    }
}