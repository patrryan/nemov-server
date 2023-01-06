export interface IPhoneServiceSendTokenForSMS {
  phone: string;
  reason: string;
}

export interface IPhoneServiceCheckToken {
  phone: string;
  token: string;
  reason: string;
}
