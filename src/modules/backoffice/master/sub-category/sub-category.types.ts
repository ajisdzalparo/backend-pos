import ApiListRequest from "../../../../common/ApiRequestList";

export interface SubCategoryCreateDto {
  name: string
  category_id: string
  description?: string | null,
}

export interface SubCategoryListRequestDto extends ApiListRequest {
	is_active?: boolean
}

export interface SubCategoryUpdateDto {
  name?: string;
  category_id: string
  description?: string;
}

export interface SubCategoryGetAllDto {
  q?: string;
}

export interface SubCategoryResponseDto {
  id: string;
  name: string;
  description: string | null;
  category_id: string
  category_name: string
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}