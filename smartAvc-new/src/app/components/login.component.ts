import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
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