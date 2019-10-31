import { ELogStationUser } from './../elogstationuser';


export class Org {

    constructor(
      public id: string,
      public name: string,
      public orgAdmin: ELogStationUser[],
      public orgMember: ELogStationUser[],
      public members: any[],
      public membersOrginal: any[],
      public admins: any[],
      public adminsOrginal: any[],
      public elds: any[],
      public eldsOrginal: any[],
      public submissions: any[]
      
    ) { }
  
  }
  