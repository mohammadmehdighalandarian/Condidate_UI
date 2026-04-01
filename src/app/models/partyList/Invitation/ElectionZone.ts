export interface ElectionZoneDto {
  id?: number;
  provinceId?: number;
  title?: string;
  electionType?: number | null;
  candidateMinCount?: number | null;
  candidateMaxCount?: number | null;
}
