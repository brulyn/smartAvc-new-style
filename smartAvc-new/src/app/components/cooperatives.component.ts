import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {AuthService} from '../shared/services/auth.service'

@Component({
    selector: 'coop-component',
    templateUrl: './cooperatives.component.html',
    providers: [AuthService]
})

export class CoopComponent implements OnInit {
    cooperatives = [];
    constructor(private http: Http, private auth:AuthService) {

    }

    ngOnInit() {
        //grab farmers
        this.http.get('http://localhost:5000/api/cooperatives')
            .subscribe(data => {
                console.log(data.json());
                this.cooperatives = data.json();
            });
    }
    logout(){
        this.auth.logout();
    }
}