import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService} from './shared/services/auth.service'

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [AuthService]
})

export class AppComponent {
    constructor(private auth: AuthService){}
 }