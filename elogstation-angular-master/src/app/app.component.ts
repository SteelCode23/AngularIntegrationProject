import { Component } from '@angular/core';
import { ELogStationAuthService } from './elogstationauth.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public eLogStationAuthService: ELogStationAuthService, public authService: AuthService) {

    this.authService.setELogStationAuthService(eLogStationAuthService);
    this.eLogStationAuthService.setAuthService(authService);

  }

}
