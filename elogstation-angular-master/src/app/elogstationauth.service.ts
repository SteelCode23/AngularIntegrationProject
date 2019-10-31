import { Injectable, Component, OnInit } from '@angular/core';
import { User } from './user';
import * as config from './props/config';
import { AuthService } from './auth.service';
import {DatePipe} from '@angular/common';
import {Observable} from "rxjs/Observable";
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as _ from 'lodash';
import { ELogStationUser } from './elogstationuser';
import { Org } from './elogmodel/org';
import { Status } from './elogmodel/status';
import { ReflectiveInjector } from '@angular/core';
import { Tracking } from './elogmodel/tracking';
import { EldNew } from './elogmodel/eldnew';
import { Truck } from './elogmodel/truck';
import { Submission } from './elogmodel/submission';


@Injectable()
export class ELogStationAuthService {

  user: ELogStationUser;
  private auth2: any;
  private httpOptions: any;
  private httpOptionsWithCredentials: any;

  public isAdmin: boolean = false;
  
  setAdmin(value: boolean): void {
      this.isAdmin = value;
  }
  
  checkAdmin(): string {
    if(this.isAdmin == true){
        return config.admin;
    } else {
        return '';
    }
  };

  private authService: AuthService;
  
  setAuthService(authService: AuthService): void {
    this.authService = authService;
  }

  public apiHost: string = "http://localhost:8080";
  public envTitle: string = "Laptop";

  getapihost(): void {
      this.http
        // .get(config.host + this.checkAdmin() + config.getorginfo, {})
        .get(config.getapihost)
        .subscribe(res => {
          this.apiHost = res.text();
        },
        err => {
          console.log('could not get the apiHost from heroku params');
          console.log(err);
        });
  }

  constructor(private http: Http) {
    this.user = <ELogStationUser>JSON.parse(localStorage.getItem('elogstationuser'));
    this.getapihost();
  }

  get isSignedIn(): boolean {
    return this.user !== null;
  }

  extractUser(googleUser: any): Promise<ELogStationUser> {

    let that = this;
    const authorizationToken = 'Basic ' + 
      window.btoa(googleUser.id + '-chrome:' + googleUser.auth);
      this.httpOptions = {
          headers: new Headers({
            'Content-Type':  'application/json',
            'Authorization': authorizationToken
          }),
          withCredentials: true
        };
        this.httpOptionsWithCredentials = {
          withCredentials: true
        };

      return new Promise((resolve, reject) => {

    this
      .http
        .post(this.apiHost + config.login, {}, this.httpOptions)
        .subscribe(res => {
            that.user = res.json();
            localStorage.setItem('elogstationuser', JSON.stringify(res.json()));
            if(res.json().admin === true) {
              this.setAdmin(true);
            } else {
              this.setAdmin(false);
            }
            // console.log(this.isAdmin);
            resolve(res.json());
        }, err => {
            reject(err); 
        });
        
    });
  }



  getorginfo(): Promise<Org[]> {

    return new Promise((resolve, reject) => {
    this.http
      // .get(config.host + this.checkAdmin() + config.getorginfo, {})
      .get(this.apiHost + this.checkAdmin() + config.getorginfo, this.httpOptionsWithCredentials)
      .subscribe(res => {
          resolve(res.json());
      },
      err => {
        if(err.status === config.unauthorizedErrorStatusCode) {
          return new Promise((resolve, reject) => {
            resolve(this.authService.signIn());
          })
          .then(function success() {
            resolve(this.getorginfo());
          }.bind(this));
        }
      });
    });

  }

  getPersons(): Promise<Org[]> {

    return new Promise((resolve, reject) => {
    this.http
      .get(this.apiHost + this.checkAdmin() + config.person, this.httpOptionsWithCredentials)
      .subscribe(res => {
          resolve(res.json());
      })
    });
  }

  getAllPersons(): Promise<Org[]> {

    return new Promise((resolve, reject) => {
    this.http
      .get(this.apiHost + this.checkAdmin() + config.personall, this.httpOptionsWithCredentials)
      .subscribe(res => {
          resolve(res.json());
      })
    });
  }

  getstatuses(sub: string, fromDate, toDate): Promise<Status[]> {

    return new Promise((resolve, reject) => {
      
    this.http
      .post(this.apiHost + this.checkAdmin() + config.status, {
        sub: sub,
        fromTime: fromDate,
        toTime: toDate
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res.json());
          resolve(res.json());
      })
    });

  }

  gettrackings(sub: string, fromDate, toDate): Promise<Tracking[]> {

    return new Promise((resolve, reject) => {
      
    this.http
      .post(this.apiHost + this.checkAdmin() + config.tracking, {
        sub: sub,
        fromTime: fromDate,
        toTime: toDate
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res.json());
          resolve(res.json());
      })
    });

  }

  gettrackingsforeld(sub: string, fromDate, toDate): Promise<Tracking[]> {

    return new Promise((resolve, reject) => {
      
    this.http
      .post(this.apiHost + this.checkAdmin() + config.trackingforeld, {
        sub: sub,
        fromTime: fromDate,
        toTime: toDate
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res.json());
          resolve(res.json());
      })
    });

  }

  signOut(): void {
    this.user = null;
    localStorage.removeItem('elogstationuser');
  }
  pipe: DatePipe;

  getTransformedDate(date: Date){
    this.pipe = new DatePipe('en-US'); 
    return this.pipe.transform(date, config.dateTimeFormat);
  }

  createNewOrg(eldNew: EldNew): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.createneworg, 
      eldNew,
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });

  }

  updateOrgInfo(eldNew: EldNew): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.updateorginfo, 
      eldNew,
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });

  }

  updatePersonInfo(newLicenseIssuingState: string, newLicenseNumber: string){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiHost + config.person, 
        {
          licenseIssuingState: newLicenseIssuingState,
          licenseNumber: newLicenseNumber
        },
        this.httpOptionsWithCredentials)
        .subscribe(res => {
            this.user.licenseIssuingState = newLicenseIssuingState;
            this.user.licenseNumber = newLicenseNumber;
            console.log(res);
            resolve(res.json());
        })
      });
  }

  deleteOrg(orgId: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.deleteorg, 
      orgId,
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });

  }

  createNewEld(eldName: string, registrationId: string, orgId: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.createneweld, 
      {
        eldName: eldName,
        registrationId: registrationId,
        orgId: orgId
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });

  }

  createNewTruck(truck: Truck, orgId: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.createnewtruck, 
      {
        truckName: truck.truckName,
        CMVPowerUnitNumber: truck.CMVPowerUnitNumber,
        CMVVIN: truck.CMVVIN,
        trailerNumbers: truck.trailerNumbers,
        orgId: orgId
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });

  }

  createNewSubmission(submission: Submission): Promise<any> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + config.createnewsubmission, 
      submission,
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        // console.log(res);
          resolve(res.json());
      })
    });

  }

  sendSubmissionToFMCSA(id: string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiHost + config.sendsubmissiontofmcsa, 
        id,
        this.httpOptionsWithCredentials)
        .subscribe(res => {
            resolve(res.json());
        })
      });
  }

  deleteEld(orgId: string, eldId: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.deleteeld, 
      {
        eldId: eldId,
        orgId: orgId
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });

  }

  deleteTruck(orgId: string, eldId: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.deletetruck, 
      {
        eldId: eldId,
        orgId: orgId
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });

  }

  addUserToGroup(orgId: string, personSub: string, memberType: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.addusertogroup, 
      {
        personSub: personSub,
        orgId: orgId,
        memberType: memberType
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });

  }

  deleteUserFromGroup(orgId: string, personSub: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.deleteuserfromgroup, 
      {
        personSub: personSub,
        orgId: orgId
      },
      this.httpOptionsWithCredentials)
      .subscribe(res => {
        console.log(res);
          resolve(res.json());
      })
    });
  }

  showSuperUsers(): Promise<any[]> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.getallsuperusers, 
      {},
      this.httpOptionsWithCredentials)
      .subscribe(res => {
          resolve(res.json());
      })
    });
  }

  showBlockedUsers(): Promise<any[]> {

    return new Promise((resolve, reject) => {
    this.http
      .post(this.apiHost + this.checkAdmin() + config.getallblockedusers, 
      {},
      this.httpOptionsWithCredentials)
      .subscribe(res => {
          resolve(res.json());
      })
    });
  }

  addToBlockedUsers(sub: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiHost + this.checkAdmin() + config.addtoblockedusers, 
        sub,
        this.httpOptionsWithCredentials)
        .subscribe(res => {
            resolve(res.json());
        })
      });
  }

  addToSuperUsers(sub: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiHost + this.checkAdmin() + config.addtosuperusers, 
        sub,
        this.httpOptionsWithCredentials)
        .subscribe(res => {
            resolve(res.json());
        })
      });
  }

  deleteFromBlockedUsers(sub: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiHost + this.checkAdmin() + config.deletefromblockedusers, 
        sub,
        this.httpOptionsWithCredentials)
        .subscribe(res => {
            resolve(res.json());
        })
      });
  } 

  deleteFromSuperUsers(sub: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiHost + this.checkAdmin() + config.deletefromsuperusers, 
        sub,
        this.httpOptionsWithCredentials)
        .subscribe(res => {
            resolve(res.json());
        })
      });
  } 

}
