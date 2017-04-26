import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import { FarmersComponent } from './components/farmers.component';
import { CollComponent } from './components/coll.component';
import { CoopComponent } from './components/cooperatives.component';
import { SettingsComponent } from './components/settings.component';
import { LoginComponent } from './components/login.component';
import { StockComponent } from './components/stock.component';
import { ProfileComponent } from './profile/profile.component';
import { TransportersComponent } from './transporters/transporters.component'
import { AuthGuard } from './shared/services/auth.guard'
export const routes: Routes = [

    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'login/:message',
        component: LoginComponent
    },
    {
        path: 'farmers',
        component: FarmersComponent,
        canActivate: [AuthGuard]
        // children: [
        //     {
        //         path: '',
        //         component: FarmersComponent
        //     }
        //     // {
        //     //     path: ':id',
        //     //     component: FarmerSingleComponent
        //     // },
        //     // {
        //     //     path: 'create',
        //     //     component: FarmerCreateComponent
        //     // },
        //     // {
        //     //     path: ':id/edit',
        //     //     component: FarmerEditComponent
        //     // }
        // ]
    },
    {
        path: 'coll',
        component: CollComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'stock',
        component: StockComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'transporters',
        component: TransportersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'cooperatives',
        component: CoopComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);