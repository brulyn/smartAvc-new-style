import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { AuthService } from './auth.service';

@Injectable()

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate() {
        return this.authService.isAuthenticated();
        // return true
    }
}