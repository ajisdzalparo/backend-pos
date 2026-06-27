import ApiListRequest from "../../../../common/ApiRequestList";

export interface TaxCreateDto {
  name: string;
  rate: number;
}

export interface TaxListRequestDto extends ApiListRequest {
	is_active?: boolean
}

export interface TaxUpdateDto {
  name?: string;
  rate?: number;
}

export interface TaxGetAllDto {
  q?: string;
}

export interface TaxResponseDto {
  id: string;
  name: string;
  rate: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}