import { prisma } from "../../../../config/database";
import { TaxCreateDto, TaxResponseDto, TaxListRequestDto, TaxGetAllDto } from "./tax.types";
import { parseListRequest } from "../../../../common/ApiRequestParser";
import { Prisma } from "@prisma/client";
import { ApiError } from "../../../../common/ApiError";

export const TaxService = {
  createTax: async (data: TaxCreateDto): Promise<TaxResponseDto> => {
    const existing = await prisma.tax.findFirst({
      where: { name: { equals: data.name, mode: 'insensitive' }, deleted_at: null }
    });
    if (existing) {
      throw new ApiError('Tax name already exists', 400);
    }
    return prisma.tax.create({ data });
  },

  getListTax: async (query: TaxListRequestDto) => {
    const parsed = parseListRequest(query);
    const isActive = typeof query.is_active === 'string' 
      ? query.is_active === 'true' 
      : query.is_active;

    const where: Prisma.TaxWhereInput = {
      is_active: isActive || true,
      name: parsed.q ? { contains: parsed.q, mode: 'insensitive' as const } : undefined,
      deleted_at: null,
    };

    const [list, total] = await Promise.all([
      prisma.tax.findMany({
        where,
        skip: parsed.skip,
        take: parsed.per_page,
        orderBy: parsed.sort_by ? { [parsed.sort_by]: parsed.sort_order } : { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          rate: true,
          is_active: true,
        },
      }),
      prisma.tax.count({ where })
    ]);

    return {
      list,
      meta: {
        page: parsed.page,
        per_page: parsed.per_page,
        total,
      }
    };
  },

	getAllTax: async (query?: TaxGetAllDto) => {
		const where: Prisma.TaxWhereInput = query?.q
			? { name: { contains: query.q, mode: 'insensitive' as const }, deleted_at: null }
			: { deleted_at: null };
		
		const list = await prisma.tax.findMany({
			where,
			select: {
				id: true,
				name: true,
				rate: true,
				is_active: true,
			},
			orderBy: { name: 'asc' }
		});

		return list;
	},

	getTaxById: async (id: string): Promise<{ id: string, name: string, is_active: boolean }> => {
		const tax = await prisma.tax.findUnique({
			where: { id, deleted_at: null },
			select: {
				id: true,
				name: true,
				rate: true,
				is_active: true,
			},
		});
		if (!tax) {
			throw new Error('Tax not found');
		}
		return tax;
	},

	toggleStatusTax: async (id: string): Promise<TaxResponseDto> => {
    const tax = await prisma.tax.findUnique({
			where: { id, is_active: true },
			select: {
				id: true,
				name: true,
				rate: true,
				is_active: true,
			},
		});
    if (!tax) {
      throw new Error('Tax not found');
    }
		const taxUpdated = await prisma.tax.update({
      where: { id },
      data: { is_active: !tax.is_active },
			select: {
				id: true,
				name: true,
				rate: true,
				is_active: true,
				created_at: true,
				updated_at: true,
				deleted_at: true,
			},
    });

		return taxUpdated;
  },

	deleteTax: async(id:string) => {
		const tax = await prisma.tax.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				is_active: true,
			},
		});
		if (!tax) {
			throw new Error('Tax not found');
		}
		return prisma.tax.update({
			where: { id },
			data: { deleted_at: new Date() },
		});
	}
};