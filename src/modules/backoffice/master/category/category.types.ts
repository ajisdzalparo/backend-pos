import ApiListRequest from "../../../../common/ApiRequestList";

export interface CategoryCreateDto {
  name: string
  description?: string | null,
}

export interface CategoryListRequestDto extends ApiListRequest {
	is_active?: boolean
}

export interface CategoryUpdateDto {
  name?: string;
  description?: string;
}

export interface CategoryGetAllDto {
  q?: string;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}