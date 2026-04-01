import { PublicationListStatus } from "src/app/enums/enums";

export class PublicationListsViewModel {
 id : number; 
 sendDate :string;
 partyCode :string;
 partyFullName :string;
 secretaryFullName :string;
 province :string;
 zoneTitle :string;
 statusTitle :string;
 status :PublicationListStatus;
 description :string;
}