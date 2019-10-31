interface ELogStationUserAuthority {
    authority: string
}

export class ELogStationUser {

    constructor(
      public sub: string,
      public deviceId: string,
      public name: string,
      public email: string,
      public picture: string,
      public licenseIssuingState: string,
      public licenseNumber: string,
      public grantedAuthority: ELogStationUserAuthority[]
    ) { }
  
  }
  