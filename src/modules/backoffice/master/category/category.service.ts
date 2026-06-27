import { prisma } from "../../../../config/database";
import { CategoryCreateDto, CategoryResponseDto, CategoryListRequestDto, CategoryGetAllDto } from "./category.types";
import { parseListRequest } from "../../../../common/ApiRequestParser";
import { Prisma } from "@prisma/client";

export const CategoryService = {
  createCategory: async (data: CategoryCreateDto): Promise<CategoryResponseDto> => {
    return prisma.category.create({ data });
  },

  getListCategory: async (query: CategoryListRequestDto) => {
    const parsed = parseListRequest(query);
    const isActive = typeof query.is_active === 'string' 
      ? query.is_active === 'true' 
      : query.is_active;

    const where: Prisma.CategoryWhereInput = {
      is_active: isActive || true,
      name: parsed.q ? { contains: parsed.q, mode: 'insensitive' as const } : undefined,
      deleted_at: null,
    };

    const [list, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip: parsed.skip,
        take: parsed.per_page,
        orderBy: parsed.sort_by ? { [parsed.sort_by]: parsed.sort_order } : { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          is_active: true,
        },
      }),
      prisma.category.count({ where })
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

	getAllCategory: async (query?: CategoryGetAllDto) => {
		const where: Prisma.CategoryWhereInput = query?.q
			? { name: { contains: query.q, mode: 'insensitive' as const }, deleted_at: null }
			: { deleted_at: null };
		
		const list = await prisma.category.findMany({
			where,
			select: {
				id: true,
				name: true,
				description: true,
				is_active: true,
			},
			orderBy: { name: 'asc' }
		});

		return list;
	},

	getCategoryById: async (id: string): Promise<{ id: string, name: string, is_active: boolean }> => {
		const Category = await prisma.category.findUnique({
			where: { id, deleted_at: null },
			select: {
				id: true,
				name: true,
				description: true,
				is_active: true,
			},
		});
		if (!Category) {
			throw new Error('Category not found');
		}
		return Category;
	},

	toggleStatusCategory: async (id: string): Promise<CategoryResponseDto> => {
    const Category = await prisma.category.findUnique({
			where: { id, is_active: true },
			select: {
				id: true,
				name: true,
				description: true,
				is_active: true,
			},
		});
    if (!Category) {
      throw new Error('Category not found');
    }
		const CategoryUpdated = await prisma.category.update({
      where: { id },
      data: { is_active: !Category.is_active },
			select: {
				id: true,
				name: true,
				description: true,
				is_active: true,
				created_at: true,
				updated_at: true,
				deleted_at: true,
			},
    });

		return CategoryUpdated;
  },

	deleteCategory: async(id:string) => {
		const Category = await prisma.category.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				is_active: true,
			},
		});
		if (!Category) {
			throw new Error('Category not found');
		}
		return prisma.category.update({
			where: { id },
			data: { deleted_at: new Date() },
		});
	}
};