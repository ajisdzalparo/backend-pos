import ApiListRequest from "../../../../common/ApiRequestList";

export interface ProductCreateDto {
  image: string;
  sku: string;
  name: string;
  category_id: string;
  tax_id: string;
  sub_category_id: string;
  base_price: number;
  item_modifier_id?: string | null;
}

export interface ProductListRequestDto extends ApiListRequest {
  is_active?: boolean;
  category_id?: string;
  sub_category_id?: string;
}

export interface ProductUpdateDto {
  image?: string;
  sku?: string;
  name?: string;
  category_id?: string;
  tax_id?: string;
  sub_category_id?: string;
  base_price?: number;
  is_active?: boolean;
  item_modifier_id?: string | null;
}

export interface ProductGetAllDto {
  q?: string;
  category_id?: string;
}

export interface ProductResponseDto {
  id: string;
  image: string;
  sku: string;
  name: string;
  category_id: string;
  tax_id: string;
  sub_category_id: string;
  base_price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  category: {
    id: string;
    name: string;
  };
  tax: {
    id: string;
    name: string;
    rate: number;
  };
  sub_category: {
    id: string;
    name: string;
  };
  item_modifier: {
    id: string;
    name: string;
    price: number;
  } | null;
}
