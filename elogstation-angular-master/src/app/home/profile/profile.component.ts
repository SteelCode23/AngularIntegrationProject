import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { AuthService } from '../../auth.service';
import { User } from '../../user';
import { RoutingService } from 'app/routing.service';
import { ELogStationAuthService } from 'app/elogstationauth.service';
import { ELogStationUser } from 'app/elogstationuser';
import { WindowRefService, ICustomWindow } from './../../window-ref.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public person: ELogStationUser;
  private _window: ICustomWindow;

  constructor(
    public eLogStationAuthService: ELogStationAuthService,
    private routingService: RoutingService,
    private authService: AuthService,
    windowRef: WindowRefService,
    private router: Router,
    private location: Location
  ) {
    this.user = this.authService.user;
    this.person = this.eLogStationAuthService.user;
    this._window = windowRef.nativeWindow;

  }

  public statesProv: string[] = ["AK","AL","AR","AS","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MP","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY","AB","BC","MB","NB","NL","NS","NT","ON","PE","QC","SK","YT","AG","BN","BS","CH","CI","CL","CP","CS","DF","DG","GE","GJ","HD","JA","MC","MR","MX","NA","NL","OA","PU","QE","QI","SI","SL","SO","TA","TB","TL","VC","YU","ZA","OT","NF","NU"];

  ngOnInit() {
    this.location.replaceState("/profile");
  }

  ngAfterViewInit() {
    var elemsSelect = document.querySelectorAll('select');
    this._window.M.FormSelect.init(elemsSelect, {});
  }


  updatePersonInfo(newLicenseIssuingState: string, newLicenseNumber: string){
    console.log('newLicenseIssuingState:' + newLicenseIssuingState);
    console.log('newLicenseNumber:' + newLicenseNumber);

    this.eLogStationAuthService.updatePersonInfo(newLicenseIssuingState, newLicenseNumber).then(result => {
      console.log('updatePersonInfo:' + result);
      if(result == true){
        this.routingService.checkOrg('true');
        this.routingService.changePage('dashboard');
      }
    });
  }

}
