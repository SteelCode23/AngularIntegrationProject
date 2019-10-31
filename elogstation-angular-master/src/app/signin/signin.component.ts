import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { ELogStationAuthService } from 'app/elogstationauth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  showProgressBar: boolean = false;
  showErrorMessage: boolean = false;
  showErrorMessageComplete: boolean = false;
  errorMessageText: string = "";
  showRightTabs: boolean = true;

  showCompleteErrorMessage(){
    if(this.showErrorMessageComplete){
      this.showErrorMessageComplete = false;
    } else {
      this.showErrorMessageComplete = true;
    }
  }

  signIn(): void {
    this.showProgressBar = true;
    this.showErrorMessage = false;
    this.errorMessageText = "";
    this.showErrorMessageComplete = false;
    this.showRightTabs = false;
    this.authService.signIn().then(user => {
    this.showProgressBar = false;
      this.router.navigate(['/home']);
    }).catch(error => {
      this.showProgressBar = false;
      this.showErrorMessage = true;
      this.showRightTabs = true;
      this.errorMessageText = JSON.stringify(error);
      console.log(error);
    });
  }

  showMain: boolean = true;
  showNews: boolean = false;
  showContact: boolean = false;

  hideAll(): void {
    this.showMain = false;
    this.showNews = false;
    this.showContact = false;  
  }

  showApp(appName: string): void {
    this.hideAll();
    if(appName == 'main'){
      this.showMain = true;
    } else if(appName == 'news'){
      this.showNews = true;
    } else if(appName == 'contact'){
      this.showContact = true;
    }
  }

}
