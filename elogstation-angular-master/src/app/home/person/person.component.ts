import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingService } from 'app/routing.service';
import { ELogStationAuthService } from './../../elogstationauth.service';
import { Status } from 'app/elogmodel/status';
import { Tracking } from 'app/elogmodel/tracking';
import { Person } from 'app/elogmodel/person';
import * as config from './../../props/config';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICustomWindow, WindowRefService } from 'app/window-ref.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
    showClearBtn: false,
    showApplyBtn: false,
    openSelectorOnInputClick: true,
    width: '66%',
    height: '44px',
    selectionTxtFontSize: '1.15rem'
};

public myForm: FormGroup;
private _window: ICustomWindow;

  constructor(
    private location: Location,
    private routingService: RoutingService,
    public eLogStationAuthService: ELogStationAuthService,
    windowRef: WindowRefService,
    private formBuilder: FormBuilder,

    ) { 
      //init

      this._window = windowRef.nativeWindow;

      
      this.fromDateInit = new Date();
      //go back one week
      this.fromDateInit.setDate(this.fromDateInit.getDate() - 7);
      this.toDateInit = new Date();

      this.fromDate = new Date();
      //go back one week
      this.fromDate.setDate(this.fromDate.getDate() - 7);
      this.toDate = new Date();
    }

  @ViewChild('daterangeStatus') daterangeStatus:any;
  @ViewChild('daterangeTracking') daterangeTracking:any;
  public myFormStatus: FormGroup;
  public myFormTracking: FormGroup;

  modalInstances: any;

  
  ngOnInit() {
    // this.location.replaceState("/person");
    this.routingService.currentPerson.subscribe(person =>
      {
        this.person = person;
        this.showPerson(person, null, null);
        this.showTracking(person, null, null);

      });    

      let that = this;
    let elem = document.querySelector('.tabs');
    var instance = this._window.M.Tabs.init(elem, {});
    this.modalInstances = instance;

    this.myFormStatus = this.formBuilder.group({
      myDateRange: ['', Validators.required]
    });

    this.myFormTracking = this.formBuilder.group({
      myDateRange: ['', Validators.required]
    });

    
    this.setDateRange();
  }

  setDateRange(): void {
    // Set date range (today) using the patchValue function
    let date = new Date();
    this.myFormStatus.patchValue({myDateRange: {
        beginDate: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate() - 7
        },
        endDate: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        }
    }});

    this.myFormTracking.patchValue({myDateRange: {
      beginDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate() - 7
      },
      endDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
      }
  }});
  }

  clearDateRange(): void {
      // Clear the date range using the patchValue function
      this.myFormStatus.patchValue({myDateRange: ''});
      this.myFormTracking.patchValue({myDateRange: ''});
  }

  showAccountInfoStatus = true;
  showAccountInfoTracking = false;

  showAccountInfo(value: string){
    this.showAccountInfoStatus = false;
    this.showAccountInfoTracking = false;
    if(value == 'status'){
      this.showAccountInfoStatus = true;
    } else if(value == 'tracking'){
      this.showAccountInfoTracking = true;
    }
  }

  currentStatuses: Status[];
  currentTrackings: Tracking[];
  person: Person;




  showPerson(person: Person, fromDate: string, toDate: string){

    if(fromDate == null){
      let fromDateTemp = new Date();
      //go back one week
      fromDateTemp.setDate(fromDateTemp.getDate() - 7);
      fromDate = this.eLogStationAuthService.getTransformedDate(fromDateTemp);
    }

    if(toDate == null){
      let toDateTemp = new Date();
      toDateTemp.setDate(toDateTemp.getDate() + 1);
      toDate = this.eLogStationAuthService.getTransformedDate(toDateTemp);
    }

    this.eLogStationAuthService.getstatuses(person.sub, fromDate, toDate).then(currentStatuses => {
      console.log(currentStatuses);
      this.currentStatuses = currentStatuses});
  }

  showTracking(person: Person, fromDate: string, toDate: string){

    if(fromDate == null){
      let fromDateTemp = new Date();
      //go back one week
      fromDateTemp.setDate(fromDateTemp.getDate() - 7);
      fromDate = this.eLogStationAuthService.getTransformedDate(fromDateTemp);
    }

    if(toDate == null){
      let toDateTemp = new Date();
      toDateTemp.setDate(toDateTemp.getDate() + 1);
      toDate = this.eLogStationAuthService.getTransformedDate(toDateTemp);
    }

    this.eLogStationAuthService.gettrackings(person.sub, fromDate, toDate).then(currentTrackings => {
      console.log(currentTrackings);
      this.currentTrackings = currentTrackings});
  }

  fromDate:Date;
  toDate:Date;
  fromDateTracking:Date;
  toDateTracking:Date;
  fromDateInit:Date;
  toDateInit:Date;

  get fromDateString():string
  {
    return this.fromDateInit.toISOString().replace( 'Z', '' );  
  }

  get toDateString():string
  {
    return this.toDateInit.toISOString().replace( 'Z', '' );  
  }

  toDateChanged(newDate: Date): void {
    this.toDate = newDate;
    this.showPerson(this.person,this.eLogStationAuthService.getTransformedDate(this.fromDate), 
    this.eLogStationAuthService.getTransformedDate(this.toDate))
  }

  fromDateChanged(newDate: Date): void {
    this.fromDate = newDate;
    this.showPerson(this.person,this.eLogStationAuthService.getTransformedDate(this.fromDate), 
    this.eLogStationAuthService.getTransformedDate(this.toDate))
  }

  onDateRangeChangedStatus(event: IMyDateRangeModel){
    console.log('Begin date: ', event.beginJsDate);
    console.log(' End date: ', event.endJsDate);
    let endDate = event.endJsDate;
    endDate.setDate(endDate.getDate() + 1);

    this.showPerson(this.person,this.eLogStationAuthService.getTransformedDate(event.beginJsDate), 
    this.eLogStationAuthService.getTransformedDate(endDate))
  }

  toDateTrackingChanged(newDate: Date): void {
    this.toDateTracking = newDate;
    this.showTracking(this.person,this.eLogStationAuthService.getTransformedDate(this.fromDateTracking), 
    this.eLogStationAuthService.getTransformedDate(this.toDateTracking))
  }

  fromDateTrackingChanged(newDate: Date): void {
    this.fromDateTracking = newDate;
    this.showTracking(this.person,this.eLogStationAuthService.getTransformedDate(this.fromDateTracking), 
    this.eLogStationAuthService.getTransformedDate(this.toDateTracking))
  }

  onDateRangeChangedTracking(event: IMyDateRangeModel){
    console.log('Begin date: ', event.beginJsDate);
    console.log(' End date: ', event.endJsDate);
    let endDate = event.endJsDate;
    endDate.setDate(endDate.getDate() + 1);

    this.showTracking(this.person,this.eLogStationAuthService.getTransformedDate(event.beginJsDate), 
    this.eLogStationAuthService.getTransformedDate(endDate))
  }

}
