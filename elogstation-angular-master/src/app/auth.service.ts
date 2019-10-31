import { Injectable } from '@angular/core';
import { User } from './user';
import { ELogStationUser } from './elogstationuser';
import * as config from './props/config';
import { ELogStationAuthService } from './elogstationauth.service';
import { Subject } from 'rxjs/Subject';

declare const gapi: any;

@Injectable()
export class AuthService {

  clientId = config.clientId;

  user: User;
  private auth2: any;
  public eLogStationAuthService: ELogStationAuthService;
  setELogStationAuthService(eLogStationAuthService: ELogStationAuthService): void {
    this.eLogStationAuthService = eLogStationAuthService;
  }

  userChange: Subject<User> = new Subject<User>();

  constructor(
  ) {
    console.log('eLogStationAuthService');
    // this.loadAuth2();
    
  }

  loadAuth2(): Promise<ELogStationUser> {
    console.log(this.eLogStationAuthService.apiHost);
    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.clientId,
          cookiepolicy: this.eLogStationAuthService.apiHost,
          scope: 'profile',
          includeAuthorizationData: true,
        }).then((auth2) => {
          this.auth2 = auth2;
          resolve(null);
        });
      });

      this.user = <User>JSON.parse(localStorage.getItem('user'));
      this.userChange.next(this.user);

    });

  }

  get isSignedIn(): boolean {
    return this.user !== null;
  }

  signIn(): Promise<ELogStationUser> {

    if (this.auth2 == undefined) {
        return this.loadAuth2().
      then(function success() {
        return new Promise((resolve, reject) => {
          resolve(this.signIn())
        });
      }.bind(this));
    } else {

    if (this.auth2.isSignedIn.get()) {
      this.user = this.extractUser(this.auth2.currentUser.get());
      localStorage.setItem('user', JSON.stringify(this.user));
      return this.eLogStationAuthService.extractUser(this.user);
    }

    return new Promise((resolve, reject) => {
      this.auth2.isSignedIn.listen(signedIn => {
        if (signedIn) {
          this.user = this.extractUser(this.auth2.currentUser.get());
          resolve(this.eLogStationAuthService.extractUser(this.user));

        } else {
          reject('sign-in error');
        }
      });
      this.auth2.signIn();
    });
  }
  }

  private extractUser(googleUser: any): User {
    const profile = googleUser.getBasicProfile();
    return new User(
      profile.getId(),
      profile.getName(),
      profile.getEmail(),
      profile.getImageUrl(),
      googleUser.getAuthResponse().id_token
    );
  }

  signOut(): void {
    this.user = null;
    localStorage.removeItem('user');
    this.auth2.isSignedIn.listen(null);
    this.auth2.signOut();
  }

}
