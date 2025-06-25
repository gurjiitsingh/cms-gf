

export type addressT = {
    name: string;
    mobNo: string;
    city: string;
    state: string;
    zipCode: string;
    addressLine1: string;
    addressLine2: string;
    userId: string;
}


    export type addressResT ={
      email:string;
      firstName:string;
      lastName:string;
      userId:string;
      mobNo:string;
      addressLine1:string;
      addressLine2:string;
      city:string;
      state:string;
      zipCode:string;
    } 

   import { Timestamp } from 'firebase/firestore';

export type addressResType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
  mobNo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt?: Timestamp; // optional Firestore server timestamp
};
