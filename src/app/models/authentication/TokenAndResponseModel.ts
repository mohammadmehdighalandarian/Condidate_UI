export class LoginResponseModel {
  token: TokenModel;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  provinceTitle: string;
  zoneTitle: string;
  profileImage: string;
  phoneNumber: string;
  roleId: number
}


export class TokenModel {
  accessToken: string;
  expiresIn: number;
}
