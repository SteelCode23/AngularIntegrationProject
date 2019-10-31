import { Component, OnInit } from '@angular/core';
import { ELogStationAuthService } from 'app/elogstationauth.service';
import { Person } from 'app/elogmodel/person';
import {Location} from '@angular/common';

@Component({
  selector: 'app-usermanage',
  templateUrl: './usermanage.component.html',
  styleUrls: ['./usermanage.component.scss']
})
export class UsermanageComponent implements OnInit {

  constructor(
    public eLogStationAuthService: ELogStationAuthService,
    private location: Location
  ) { }

  ngOnInit(
  ) {
    this.location.replaceState("/profile");    
  }

  persons: Person[];
  
  ngAfterViewInit() {
    let that = this;
    this.eLogStationAuthService.getAllPersons()
      .then(function success(persons: Person[]){
        this.persons = persons;
        this.showSuperUsers();
        this.showBlockedUsers();
      }.bind(this));
    }

    showSuperUsers() {
      let that = this;
      this.eLogStationAuthService.showSuperUsers()
        .then(function success(personSubs: any[]){
          for(let i=0; i < personSubs.length; i++){
            let obj = this.persons.find(obj => obj.sub == personSubs[i].sub);
            obj.isSuperUser = true;
          }
        }.bind(this));
    }

    showBlockedUsers() {
      let that = this;
      this.eLogStationAuthService.showBlockedUsers()
        .then(function success(personSubs: any[]){
          for(let i=0; i < personSubs.length; i++){
            let obj = this.persons.find(obj => obj.sub == personSubs[i].sub);
            obj.isBlockedUser = true;
          }
        }.bind(this));
    }

    blockedUserCheckboxClicked(person) {
      if(person.isBlockedUser == null){
        this.eLogStationAuthService.addToBlockedUsers(person.sub);
        person.isBlockedUser = true;
      } else {
        this.eLogStationAuthService.deleteFromBlockedUsers(person.sub);
        person.isBlockedUser = false;
      }
    }

    superUserCheckboxClicked(person) {
      if(person.isSuperUser == null){
        this.eLogStationAuthService.addToSuperUsers(person.sub);
        person.isSuperUser = true;
      } else {
        this.eLogStationAuthService.deleteFromSuperUsers(person.sub);
        person.isSuperUser = false;
      }
    }

}
