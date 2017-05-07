import { Facebook, GooglePlus } from 'ionic-native';

export class Auth {

    constructor(public f: Facebook) { }

    login(){
        return Facebook.login(['email'])
    }

    logout(){
        return Facebook.logout();
    }

}
