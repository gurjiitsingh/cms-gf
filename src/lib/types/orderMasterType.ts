export type orderMasterDataT = {
  id: string;
  customerName: string;
 // email:string;
  userId: string;
  addressId: string;
  time: string;
  endTotalG: number;
  itemTotal: number;
  paymentType: string;
  totalDiscountG: number;
  flatDiscount: number;
  status: string;
  srno: number;
  timeId: string;
  deliveryCost: number;
  calculatedPickUpDiscountL: number;
  calCouponDiscount: number;
  couponDiscountPercentL: number;
  pickUpDiscountPercentL: number;
};

export type TOrderMaster = {
  id: string;
  addressId: string;
  customerName: string;
  time: string;
  userId: string;
  status: string;
  srno: number;
};
