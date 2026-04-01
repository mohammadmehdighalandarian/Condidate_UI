export interface PartyListZoneConfig {
  zoneTitle: string;
  minCandidates: number;
  maxCandidates: number;
}

export interface PartyListProvinceConfig {
  provinceTitle: string;
  zones: PartyListZoneConfig[];
}

export const PARTY_LIST_CONFIG: PartyListProvinceConfig[] = [
  {
    provinceTitle: 'تهران',
    zones: [
      { zoneTitle: 'تهران', minCandidates: 1, maxCandidates: 5 },
      { zoneTitle: 'ری', minCandidates: 1, maxCandidates: 3 },
      { zoneTitle: 'اسلامشهر', minCandidates: 1, maxCandidates: 3 },
      { zoneTitle: 'شمیرانات', minCandidates: 1, maxCandidates: 3 },
      { zoneTitle: 'پردیس', minCandidates: 1, maxCandidates: 3 },
    ],
  },
];
