import { Component, OnInit } from '@angular/core';
import { ELogStationAuthService } from './../../elogstationauth.service';
import { Org } from 'app/elogmodel/org';
import { Person } from 'app/elogmodel/person';
import { RoutingService } from 'app/routing.service';
import {Location} from '@angular/common';
import { Eld } from 'app/elogmodel/eld';
import { ICustomWindow, WindowRefService } from 'app/window-ref.service';
import { EldNew } from 'app/elogmodel/eldnew';
import { Truck } from 'app/elogmodel/truck';
import { Submission } from 'app/elogmodel/submission';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public eLogStationAuthService: ELogStationAuthService,
    private routingService: RoutingService,
    private location: Location,
    windowRef: WindowRefService

  ) { 
    this._window = windowRef.nativeWindow;

  }

  modalInstance: any;
  modalInstanceDelete: any;
  modalInstanceEntityDelete: any;

  ngAfterViewInit() {
    let that = this;
    let elems = document.querySelectorAll('.modal');
    let instances = this._window.M.Modal.init(elems, {
      startingTop: '24%',
      dismissible: true
    });
    this.modalInstance = instances[0];
    this.modalInstanceDelete = instances[1];
    this.modalInstanceEntityDelete = instances[2];
  }

  org: Org[];
  showSingleOrg: boolean = false;
  singleOrg: Org;
  aboutToBeDeletedOrg: Org;
  private _window: ICustomWindow;

  chooseAboutToBeDeletedOrg(aboutToBeDeletedOrg: Org){
    this.aboutToBeDeletedOrg = aboutToBeDeletedOrg;
    this.modalInstanceDelete.open();
  }

  shouldIDeleteOrg(isTrue: boolean){
    console.log(isTrue);
    let that = this;
    this.modalInstanceDelete.close();
    if(isTrue == true){
      this.eLogStationAuthService.deleteOrg(this.aboutToBeDeletedOrg.id).then(result => {
        console.log('deleteOrg:' + result);
        if(result == true){
          that.showAllOrgs();
        }
      });
    }
  }

  entityToBeDeletedId: string;
  entityToBeDeletedDisplay: string;
  entityToBeDeletedType: string;

  chooseAboutToBeDeletedEntity(entity: string, id: string, display: string){
    console.log(entity, id);
    this.entityToBeDeletedId = id;
    this.entityToBeDeletedDisplay = display;
    this.entityToBeDeletedType = entity;
    this.modalInstanceEntityDelete.open();
  }

  shouldIDeleteEntity(isTrue: boolean){
    let that = this;
    this.modalInstanceEntityDelete.close();
    if(isTrue == true){
      if(this.entityToBeDeletedType == 'eld'){
        this.eLogStationAuthService.deleteEld(this.singleOrg.id, this.entityToBeDeletedId).then(result => {
          console.log('deleteEld:' + result);
          if(result == true){
            that.showAllOrgs();
          }
        });
      } else if(this.entityToBeDeletedType == 'member' || this.entityToBeDeletedType == 'admin'){
        this.eLogStationAuthService.deleteUserFromGroup(this.singleOrg.id, this.entityToBeDeletedId).then(result => {
          console.log('deleteUserFromGroup:' + result);
          if(result == true){
            that.showAllOrgs();
          }
        });
      } else if(this.entityToBeDeletedType == 'truck'){
        this.eLogStationAuthService.deleteTruck(this.singleOrg.id, this.entityToBeDeletedId).then(result => {
          console.log('deleteTruck:' + result);
          if(result == true){
            that.showAllOrgs();
          }
        });
      }
    }
  }

  showAllOrgs(){
    this.eLogStationAuthService.getorginfo().then(result => {
      this.org = result;
      if(this.org.length == 1 && !this.eLogStationAuthService.isAdmin){
        this.selectOrg(this.org[0]);
      }else{
        this.modalInstance.open();
      }
    });
  }
  ngOnInit() {
    this.showAllOrgs();
    this.location.replaceState("/home");
    this.routingService.currentOrg.subscribe(value => this.showAllOrgs());
    this.routingService.dashboardSub.subscribe(sub => this.showDashboardSub(sub));
    this.routingService.currentSingleOrg.subscribe(singleOrg => this.singleOrg = singleOrg);
  }

  showAdmins: boolean = false;
  showMembers: boolean = false;
  showElds: boolean = false;
  showTrucks: boolean = false;
  showSubmissions: boolean = false;

  showCount: boolean = true;
  hideSubs(){
    this.showAdmins = false;
    this.showMembers = false;
    this.showElds = false;
    this.showTrucks = false;
    this.showSubmissions = false;
  }

  onSearchChangeAdmins(name){
    this.singleOrg.admins = this.singleOrg.adminsOrginal;
    if(name.trim().length > 0){
      this.singleOrg.admins = this.singleOrg.admins.filter(member => 
      member.name.toLowerCase().includes(name.toLowerCase())
      )
    }
  }

  onSearchChangeMembers(name){
    this.singleOrg.members = this.singleOrg.membersOrginal;
    if(name.trim().length > 0){
      this.singleOrg.members = this.singleOrg.members.filter(member => 
      member.name.toLowerCase().includes(name.toLowerCase())
      )
    }
  }

  onSearchChangeElds(name){
    this.singleOrg.elds = this.singleOrg.eldsOrginal;
    if(name.trim().length > 0){
      this.singleOrg.elds = this.singleOrg.elds.filter(member => 
      member.name.toLowerCase().includes(name.toLowerCase())
      )
    }
  }

  showSubs(){
    this.showAdmins = true;
    this.showMembers = true;
    this.showElds = true;
    this.showTrucks = true;
    this.showSubmissions = true;
  }

  showCountValue(){
    this.showCount = true;
  }

  hideCountValue(){
    this.showCount = false;
  }

  showDashboardSub(sub: string){
    console.log('sub')
    console.log(sub)
    if(sub != 'checkOrgValue'){
      this.hideSubs();
    }
    if(sub == 'all'){
      this.hideSubs();
      this.showCountValue();
      return;
    }
    switch(sub){
      case 'admins':
        this.showAdmins = true;
        break;
      case 'members':
        this.showMembers = true;
        break;
      case 'elds':
        this.showElds = true;
        break;
      case 'trucks':
        this.showTrucks = true;
        break;
      case 'submissions':
        this.showSubmissions = true;
        break;
    }
      this.hideCountValue();
  }

  selectOrg(singleOrg: Org) {
    this.singleOrg = singleOrg;
    this.singleOrg.adminsOrginal = this.singleOrg.admins;
    this.singleOrg.membersOrginal = this.singleOrg.members;
    this.singleOrg.eldsOrginal = this.singleOrg.elds;
    this.showSingleOrg = true;
    this.modalInstance.close();
    console.log(singleOrg);
  }

  openOrganizationSelector(){
    this.modalInstance.open();
  }

  createNewEntity(entity: string){
    console.log('entity: ' + entity);
    this.routingService.changePage('showCreateNewEntity');
    this.routingService.changeEntity(entity, this.singleOrg);
  }

  openPerson(person: Person){
    console.log('openPerson: ' + person.sub);
    this.routingService.changePage('openPerson');
    this.routingService.changePerson(person);
  }

  openEld(eld: Eld){
    console.log('openEld: ');
    console.log(eld);
    this.routingService.changePage('openEld');
    this.routingService.changeEld(eld);
  }

  openTruck(truck: Truck){
    console.log('openTruck: ');
    console.log(truck);
  }

  
  updateOrgInfo(id: string, usdotNumber: string, multiDayBasisUsed: number, twentyFourHourPeriodTimeStartingTime: string, timeOffsetFromUTC: string){
    console.log('orgId:' + id);
    var eldNew = new EldNew(id, null, null, usdotNumber, multiDayBasisUsed, twentyFourHourPeriodTimeStartingTime, timeOffsetFromUTC);

    this.eLogStationAuthService.updateOrgInfo(eldNew).then(result => {
      console.log('updateOrgInfo:' + result);
      if(result == true){
        this.routingService.checkOrg('true');
        this.routingService.changePage('dashboard');
      }
    });
  }

  openSubmission(singleOrgSubmission: Submission){
    console.log(singleOrgSubmission);

    this.eLogStationAuthService.sendSubmissionToFMCSA(singleOrgSubmission.id).then(result => {
      console.log('sendSubmissionToFMCSA:' + result);
      if(result != null && result.isSuccess != null && result.isSuccess == false){
        this._window.M.toast({html: result.finalMessage, classes: 'rounded'});
      } else {
        console.log('done');
      }
    });
  }

}
