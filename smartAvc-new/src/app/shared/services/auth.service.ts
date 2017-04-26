import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

export interface User {
    email: string;
    password: string;
    //confirmPassword?: string;
    account_type: string;
    first_name: string;
    last_name: string;
    department: string;
}

// Our firebase variable from index.html,..... yes we are using JavaScript Firebase code
declare var firebase: any;
@Injectable()
export class AuthService {
    errorMessage: any = "";
    email: any;
    constructor(private router: Router) { }

    signupUser(user: User) {
        var email = user.email + "@smartavc.com"
        var errorMessage = this.errorMessage
        firebase.auth().createUserWithEmailAndPassword(email, user.password)
            .then(
            (currentUser) => {
                var username = user.email;
                firebase.database().ref('/subscribers/' + currentUser.uid).set({
                    username: username,
                    email: user.email,
                    account_type: user.account_type,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    department: user.department
                })
                this.router.navigate(['/farmers'])
            })
            .catch(function (error) {
                errorMessage = error.message
                console.log(error);
            });
    }

    signinUser(user) {
        let router = this.router;
        var errorMessage = this.errorMessage
        firebase.auth().signInWithEmailAndPassword(user.email+"@smartavc.com", user.password)
            .then(
            () => {
                this.router.navigate(['/farmers'])
            }
            )
            .catch(function (error) {
                console.log(error.code);
                errorMessage = error.code;
                router.navigate(['/login', error.code]);
            });

    }

    logout() {
        firebase.auth().signOut().then(
            () => {
                this.router.navigate(['/login']);
            }
        );

    }

    isAuthenticated() {
        var user = firebase.auth().currentUser;
        if (user) {
            return true;
        } else {
            return false;
        }
    }
}