import ApiListRequest from "./ApiRequestList";

export interface ParsedListRequest extends ApiListRequest {
  page: number;
  per_page: number;
  skip: number;
}

export const parseBoolean = (val: any): boolean | undefined => {
  if (val === undefined || val === null || val === '') return undefined;
  if (val === 'true' || val === true || val === '1' || val === 1) return true;
  if (val === 'false' || val === false || val === '0' || val === 0) return false;
  return undefined;
};

export const parseListRequest = (query: any): ParsedListRequest => {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const per_page = Math.max(1, parseInt(query.per_page as string, 10) || 10);
  const skip = (page - 1) * per_page;

  return {
    page,
    per_page,
    skip,
    q: query.q ? String(query.q) : undefined,
    sort_by: query.sort_by ? String(query.sort_by) : undefined,
    sort_order: query.sort_order === 'asc' ? 'asc' : 'desc',
  };
};
