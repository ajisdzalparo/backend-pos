import ApiListRequest from "../../../../common/ApiRequestList";

export interface ItemModifierProductDto {
  id: string;
  name: string;
  sku: string;
}

export interface ItemModifierCreateDto {
  name: string;
  price: number;
  product_ids?: string[];
}

export interface ItemModifierListRequestDto extends ApiListRequest {
  is_active?: boolean;
}

export interface ItemModifierUpdateDto {
  name?: string;
  price?: number;
  product_ids?: string[];
}

export interface ItemModifierGetAllDto {
  q?: string;
}

export interface ItemModifierResponseDto {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  products: ItemModifierProductDto[];
}