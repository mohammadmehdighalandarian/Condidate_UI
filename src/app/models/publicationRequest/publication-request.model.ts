export interface PublicationRequestItem {
  publicationRequestId: number;
  rowNumber: number;
  sendDate: string;
  statusTitle: string;
  province: string;
  provinceId: number;
  electionZoneTitle: string;
  zoneId:number;
  electionType: number;
  description: string;
}

export interface PublicationRequestCandidateItem {
  code: string;
  fullName: string;
  provinceTitle: string;
  ZoneTitle: string;
}
