import { Component, OnInit, ViewChild } from '@angular/core';
import { RoutingService } from 'app/routing.service';
import { ELogStationAuthService } from 'app/elogstationauth.service';
import { Eld } from 'app/elogmodel/eld';
import {Location} from '@angular/common';
import { Tracking } from 'app/elogmodel/tracking';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICustomWindow, WindowRefService } from 'app/window-ref.service';

@Component({
  selector: 'app-eld',
  templateUrl: './eld.component.html',
  styleUrls: ['./eld.component.scss']
})
export class EldComponent implements OnInit {

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

  constructor(private location: Location,
    private routingService: RoutingService,
    public eLogStationAuthService: ELogStationAuthService,
    private formBuilder: FormBuilder,
    windowRef: WindowRefService

    ) { 
      this._window = windowRef.nativeWindow;
  
    }
  
  @ViewChild('daterange') daterange:any;

  eld: Eld;
  currentTrackings: Tracking[];
  modalInstances: any;

  ngAfterViewInit() {
    let that = this;
    let elems = document.querySelectorAll('.tabs');
    var instances = this._window.M.Tabs.init(elems, {});
    this.modalInstances = instances;
  }

  ngOnInit() {
    // this.location.replaceState("/eld");
    this.routingService.currentEld.subscribe(eld => { 
      this.eld = eld;
      this.showEld(eld, null, null);
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

  clearDateRange(): void {
      // Clear the date range using the patchValue function
      this.myForm.patchValue({myDateRange: ''});
  }

  showEld(eld: Eld, fromDate: string, toDate: string){
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

    this.eLogStationAuthService.gettrackingsforeld(eld.name, fromDate, toDate).then(currentTrackings => {
      console.log(currentTrackings);
      this.currentTrackings = currentTrackings});
  }

  onDateRangeChanged(event: IMyDateRangeModel){
    console.log('Begin date: ', event.beginJsDate);
    console.log(' End date: ', event.endJsDate);
    let endDate = event.endJsDate;
    endDate.setDate(endDate.getDate() + 1);

    this.showEld(this.eld,this.eLogStationAuthService.getTransformedDate(event.beginJsDate), 
    this.eLogStationAuthService.getTransformedDate(endDate))
  }
}
