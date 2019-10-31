import { Component, OnInit, ElementRef, QueryList, 
  ViewChild, ViewChildren } from '@angular/core';
import {Location} from '@angular/common';
import { RoutingService } from 'app/routing.service';
import { ELogStationAuthService } from './../../elogstationauth.service';
import { WindowRefService, ICustomWindow } from './../../window-ref.service';
import { Person } from 'app/elogmodel/person';
import { Org } from 'app/elogmodel/org';
import { EldNew } from 'app/elogmodel/eldnew';
import { Truck } from 'app/elogmodel/truck';
import { GeolocationService } from 'app/geolocation.service';
import { Submission } from 'app/elogmodel/submission';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-createnewentity',
  templateUrl: './createnewentity.component.html',
  styleUrls: ['./createnewentity.component.scss']
})
export class CreatenewentityComponent implements OnInit {

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

  @ViewChild('adminList') adminList: ElementRef; 
  private _window: ICustomWindow;

  constructor(
    private location: Location,
    private routingService: RoutingService,
    public eLogStationAuthService: ELogStationAuthService,
    private formBuilder: FormBuilder,
    windowRef: WindowRefService,
    private geolocationService: GeolocationService
  ) {
    this._window = windowRef.nativeWindow;
   }

  singleOrg: Org;

  ngOnInit() {
    // this.location.replaceState("/createnewentity");
    this.routingService.currentEntity.subscribe(entity => this.showEntity(entity));
    this.routingService.currentEntityOrg.subscribe(singleOrg => {
      this.singleOrg = singleOrg;
    });
    this.myForm = this.formBuilder.group({
        myDateRange: ['', Validators.required]
    });

    this.setDateRange();
  }

  setDateRange(): void {
    // Set date range (today) using the patchValue function
    let date = new Date();
    this.myForm.patchValue({myDateRange: {
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

  persons: Person[];
  personsWithNameId: any[];
  currentLatitude: string;
  currentLongitude: string;

  ngAfterViewInit() {
    let that = this;
    this.eLogStationAuthService.getPersons()
      .then(function success(persons: Person[]){
        this.persons = persons;
        let data = [];
        let personsWithNameId = [];
        for(let i=0; i<persons.length; i++){
          data[persons[i].name +  '(' + persons[i].sub + ')' ] = persons[i].picture;
          personsWithNameId[persons[i].name +  '(' + persons[i].sub + ')'] = persons[i];
        }
        this.personsWithNameId = personsWithNameId;
        const ac = document.querySelector('.autocomplete');
        this._window.M.Autocomplete.init(ac, {
          data: data,
          onAutocomplete: function(e: any) {
            console.log(e);
            console.log(that.personsWithNameId[e]);
            that.doActionBasedOnEntity(that.personsWithNameId[e].sub);
          }
        },
        );
        var elems = document.querySelectorAll('.collapsible');
        this._window.M.Collapsible.init(elems, {accordion: false});
        var elemsSelect = document.querySelectorAll('select');
        this._window.M.FormSelect.init(elemsSelect, {});
    }.bind(this));
    this.geolocationService.getLocation({}).subscribe(
        function(position) {
          console.log(position); 
          that.currentLatitude = position.coords.latitude;
          that.currentLongitude = position.coords.longitude;
        },
        function(error) { 
          console.log(error);
         }
    );
    
  }

  createNewOrg(name: string){
    console.log('new org:' + name.trim());
    var eldNew = new EldNew(null, null, name.trim(), null, null, null, null);

    this.eLogStationAuthService.createNewOrg(eldNew).then(result => {
      console.log('createNewOrg:' + result);
      if(result == true){
        this.routingService.checkOrg('true');
        this.routingService.changePage('dashboard');
      }
    });
  }


  doActionBasedOnEntity(sub: string){ 
    console.log('doActionBasedOnEntity');
    let memberType = 'MEMBER';
    if(this.showAdmins){
      memberType = 'ADMIN';
    }
    this.eLogStationAuthService.addUserToGroup(this.singleOrg.id, sub, memberType).then(result => {
      console.log('addUserToGroup:' + result);
      if(result == true){
        this.routingService.checkOrg('true');
        this.routingService.changePage('dashboard');
      }
    });

  }

  createNewEld(eldName: string, registrationId: string){
    if(eldName.trim().length > 0){
      this.eLogStationAuthService.createNewEld(eldName.trim(), registrationId.trim(), this.singleOrg.id).then(result => {
        console.log('createNewEld:' + result);
        if(result == true){
          this.routingService.checkOrg('true');
          this.routingService.changePage('dashboard');
        }
      });
    }
  }

  createNewTruck(newTruckName: string, newTruckCMVPowerUnitNumber: string, newTruckCMVVIN: string, newTruckTrailerNumbers: string){
    if(newTruckName.trim().length > 0){
      var truckNew = new Truck(null, newTruckName.trim(), newTruckCMVPowerUnitNumber, newTruckCMVVIN, newTruckTrailerNumbers);

      this.eLogStationAuthService.createNewTruck(truckNew, this.singleOrg.id).then(result => {
        console.log('createNewTruck:' + result);
        if(result == true){
          this.routingService.checkOrg('true');
          this.routingService.changePage('dashboard');
        }
      });
    }
  }

  showOrg: boolean = false;
  showAdmins: boolean = false;
  showMembers: boolean = false;
  showElds: boolean = false;
  showTrucks: boolean = false;
  showSubmissions: boolean = false;
  
  hideEverything(){
    this.showOrg = false;
    this.showAdmins = false;
    this.showMembers = false;
    this.showElds = false;
    this.showTrucks = false;
    this.showSubmissions = false;
  }

  showEntity(entity: string){
    console.log('entity: ' + entity);
    this.hideEverything();
    switch(entity){
      case 'org':
        this.showOrg = true;
      break;
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

      default:
        this.showOrg = true;

      }
  }

  onDateRangeChanged(event: IMyDateRangeModel){
    
    console.log('Begin date: ', event.beginJsDate);
    console.log(' End date: ', event.endJsDate);
    let endDate = event.endJsDate;
    endDate.setDate(endDate.getDate() + 1);

    let fromDate = this.eLogStationAuthService.getTransformedDate(event.beginJsDate);
    let toDate = this.eLogStationAuthService.getTransformedDate(endDate);

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

    this.fromDate = fromDate;
    this.toDate = toDate;

  }

  fromDate: any;
  toDate: any;

  createNewSubmissions(form: any){
    console.log(form.value);
    var submissionNew = new Submission();
    submissionNew.name = 'jeee12_nocodriver2';
    submissionNew.orgId = this.singleOrg.id;
    submissionNew.driver = form.value.driver;
    submissionNew.codriver = form.value.codriver;
    submissionNew.eld = form.value.eld;
    submissionNew.newELDAuthenticationValue = form.value.newELDAuthenticationValue;
    submissionNew.newExemptDriverConfiguration = form.value.newExemptDriverConfiguration;
    submissionNew.newOutputFileComment = form.value.newOutputFileComment;
    submissionNew.newShippingDocumentNumber = form.value.newShippingDocumentNumber;
    submissionNew.truck = form.value.truck;
    submissionNew.newCurrentTotalVehicleMiles = form.value.newCurrentTotalVehicleMiles; 
    submissionNew.newCurrentTotalEngineHours = form.value.newCurrentTotalEngineHours;
    submissionNew.currentLatitude = this.currentLatitude;
    submissionNew.currentLongitude = this.currentLongitude;
    submissionNew.fromTime = this.fromDate;
    submissionNew.toTime = this.toDate;
    

    this.eLogStationAuthService.createNewSubmission(submissionNew).then(result => {
      console.log('createNewSubmissions:' + result);
      if(result != null && result.isSuccess != null && result.isSuccess == false){
        this._window.M.toast({html: result.finalMessage, classes: 'rounded'});
      } else {
        // this.routingService.checkOrg('true');
        this.singleOrg.submissions.unshift(result);
        this.routingService.changeSingleOrg(this.singleOrg);
        this.routingService.changePage('dashboardSubmissions');        
      }
    });
  }
}
