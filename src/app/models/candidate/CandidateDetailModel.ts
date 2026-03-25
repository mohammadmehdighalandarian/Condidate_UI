import { SocialMediaModel } from "./SocialMediaModel";
import { WebsiteModel } from "./WebsiteModel";

export class CandidateDetailModel {
  candidateId: string;
  fullName: string;
  provinceTitle: string;
  zoneTitle: string;
  universityTitle: string;
  educationLevelTitle: string;
  fieldTendencyTitle: string;
  jobOrganizationTitle: string;
  jobTitle: string;
  biography: string | null;
  socialMedias: SocialMediaModel[];
  webSites: WebsiteModel[];
  imageUrl?: string | null;
}