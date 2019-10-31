import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import { RoutingService } from 'app/routing.service';
import { MyDateRangePickerModule } from 'mydaterangepicker';

import { ELogStationAuthService } from './elogstationauth.service';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProfileComponent } from './home/profile/profile.component';
import { CreatenewentityComponent } from './home/createnewentity/createnewentity.component';
import { WindowRefService } from './window-ref.service';
import { PersonComponent } from './home/person/person.component';
import { EldComponent } from './home/eld/eld.component';
import { UsermanageComponent } from './home/usermanage/usermanage.component';
import { FirstNamePipe } from './pipes/firstnamepipe';
import { SubmissionComponent } from './home/submission/submission.component';
import { GeolocationService } from './geolocation.service';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    CreatenewentityComponent,
    PersonComponent,
    EldComponent,
    UsermanageComponent,
    FirstNamePipe,
    SubmissionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule, ReactiveFormsModule,
    MyDateRangePickerModule
  ],
  providers: [AuthService, 
    AuthGuard, 
    ELogStationAuthService, 
    RoutingService,
    WindowRefService,
    GeolocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
