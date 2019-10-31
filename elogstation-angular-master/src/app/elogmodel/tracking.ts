import { User } from './user';

export class Tracking {

    constructor(
      public id: string,
      public sub: string,
      public deviceId: string,
      public eldId: string,
      public latitude: string,
      public longitude: string,
      public odometer: string,
      public rpm: string,
      public speed: string,
      public gpsDateTime: string
    ) { }
  
  }
  