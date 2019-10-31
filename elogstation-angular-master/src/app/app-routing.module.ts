import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProfileComponent } from './home/profile/profile.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: SigninComponent },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'home/profile', component: HomeComponent, canActivate: [AuthGuard] },
      {path: '**', component: SigninComponent}
      // { path: 'home/dashboard/createnewentity', component: HomeComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
