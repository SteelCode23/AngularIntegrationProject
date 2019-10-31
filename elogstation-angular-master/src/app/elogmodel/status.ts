import { User } from './user';

export class Status {

    constructor(
      public id: string,
      public user: User,
      public statusType: string,
    ) { }
  
  }
  