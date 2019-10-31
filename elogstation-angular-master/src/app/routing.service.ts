import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Person } from 'app/elogmodel/person';
import { Eld } from './elogmodel/eld';
import { Org } from './elogmodel/org';

declare const gapi: any;

@Injectable()
export class RoutingService {
  private messageSource = new BehaviorSubject('dashboard');
  currentPage = this.messageSource.asObservable();

  private entitySource = new BehaviorSubject('org');
  currentEntity = this.entitySource.asObservable();

  singleOrg: Org;
  private entitySourceOrg = new BehaviorSubject(this.singleOrg);
  currentEntityOrg = this.entitySourceOrg.asObservable();

  private currentSourceOrg = new BehaviorSubject(this.singleOrg);
  currentSingleOrg = this.currentSourceOrg.asObservable();

  person: Person;
  private personSource = new BehaviorSubject(this.person);
  currentPerson = this.personSource.asObservable();

  eld: Eld;
  private eldSource = new BehaviorSubject(this.eld);
  currentEld = this.eldSource.asObservable();

  private orgSource = new BehaviorSubject('checkOrgValue');
  currentOrg = this.orgSource.asObservable();

  private dashboardSubSource = new BehaviorSubject('checkOrgValue');
  dashboardSub = this.dashboardSubSource.asObservable();

  constructor() { }

  
  openDashboardSub(value: string) {
    this.dashboardSubSource.next(value)
  }

  checkOrg(value: string) {
    this.orgSource.next(value)
  }

  changePage(page: string) {
    this.messageSource.next(page)
  }

  changeEntity(entity: string, singleOrg: Org) {
    this.entitySourceOrg.next(singleOrg);
    this.entitySource.next(entity);
  }

  changeSingleOrg(singleOrg: Org) {
    this.currentSourceOrg.next(singleOrg);
  }

  changePerson(person: Person) {
    this.personSource.next(person);
  }

  changeEld(eld: Eld){
    this.eldSource.next(eld);
  }
}