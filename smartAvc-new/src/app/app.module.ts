import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { HttpModule } from '@angular/http';
import {PopupModule} from 'ng2-opd-popup';


import { AppComponent } from './app.component';
import { FarmersComponent } from './components/farmers.component';
import { CollComponent } from './components/coll.component';
import { LoginComponent } from './components/login.component';
import { CoopComponent } from './components/cooperatives.component';
import { StockComponent } from './components/stock.component'
import { routing } from './app.routing';
import { FarmerService } from './shared/services/farmer.service';
import { SettingsComponent } from './components/settings.component';
import { AuthGuard } from './shared/services/auth.guard';
import { AuthService } from './shared/services/auth.service'


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { TransportersComponent } from './transporters/transporters.component';
import { UsersComponent } from './users/users.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [
        AppComponent,
        FarmersComponent,
        CollComponent,
        CoopComponent,
        SettingsComponent,
        LoginComponent,
        StockComponent,
        SideMenuComponent,
        TopMenuComponent,
        FooterComponent,
        ProfileComponent,
        TransportersComponent,
        UsersComponent
    ],
    providers: [
        FarmerService,
        AuthGuard,
        AuthService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }