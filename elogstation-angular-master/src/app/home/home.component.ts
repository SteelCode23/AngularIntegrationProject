import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { RoutingService } from 'app/routing.service';
import { ELogStationAuthService } from 'app/elogstationauth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  private user: User;

  constructor(
    public eLogStationAuthService: ELogStationAuthService,
    private authService: AuthService,
    private router: Router,
    private routingService: RoutingService,
    private location: Location
  ) {
    this.user = this.authService.user;
    this.authService.userChange.subscribe((user) => { 
      this.user = user; 
    });
  }

  ngOnInit() {
    this.location.replaceState("/home");
    this.routingService.currentPage.subscribe(page => this.showApp(page));
  }

  signOut(): void {
    this.eLogStationAuthService.signOut();
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  showDashboard: boolean = true;
  showProfile: boolean = false;
  showCreateNewEntity: boolean = false;
  showSubmission: boolean = false;
  openPerson: boolean = false;
  openEld: boolean = false;
  userManage: boolean = false;
  
  hideEverything(){
    this.showDashboard = false;
    this.showProfile = false;
    this.showCreateNewEntity = false;
    this.showSubmission = false;
    this.openPerson = false;
    this.openEld = false;
    this.userManage = false;
  }

  showApp(page: string){
    console.log('page: ' + page);
    this.hideEverything();
    switch(page){
      case 'dashboard':
        this.location.replaceState("/home");
        this.showDashboard = true;
        this.routingService.openDashboardSub('all');
        break;

      case 'dashboardAdmins':
        this.showDashboard = true;
        this.routingService.openDashboardSub('admins');
      break;

      case 'dashboardMembers':
        this.showDashboard = true;
        this.routingService.openDashboardSub('members');
      break;
      
      case 'dashboardElds':
        this.showDashboard = true;
        this.routingService.openDashboardSub('elds');
      break;

      case 'dashboardTrucks':
        this.showDashboard = true;
        this.routingService.openDashboardSub('trucks');
      break;

      case 'dashboardSubmissions':
        this.showDashboard = true;
        this.showSubmission = true;
        this.routingService.openDashboardSub('submissions');
      break;

      case 'profile':
        this.showProfile = true;
      break;

      case 'showCreateNewEntity':
        this.showCreateNewEntity = true;
      break;

      case 'openPerson':
        this.openPerson = true;
      break;

      case 'openEld':
        this.openEld = true;
      break;

      case 'userManage':
        this.userManage = true;
      break;

      case 'logout':
        this.signOut();
      break;

      default:
        this.showDashboard = true;

      }
  }

}
