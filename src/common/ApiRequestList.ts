interface ApiListRequest {
  page?: number;
  per_page?: number;
  q?: string;
  sort_by?: string;
  sort_order?: string;
}

export default ApiListRequest;