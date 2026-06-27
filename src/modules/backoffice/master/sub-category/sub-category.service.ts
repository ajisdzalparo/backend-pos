import { prisma } from "../../../../config/database";
import { SubCategoryCreateDto, SubCategoryResponseDto, SubCategoryListRequestDto, SubCategoryGetAllDto } from "./sub-category.types";
import { parseListRequest } from "../../../../common/ApiRequestParser";
import { Prisma } from "@prisma/client";

export const SubCategoryService = {
  createSubCategory: async (data: SubCategoryCreateDto): Promise<SubCategoryResponseDto> => {
    const subCategory = await prisma.subCategory.create({
      data,
      include: {
        category: true,
      }
    });

    return {
      id: subCategory.id,
      name: subCategory.name,
      description: subCategory.description,
      category_id: subCategory.category_id,
      category_name: subCategory.category.name,
      is_active: subCategory.is_active,
      created_at: subCategory.created_at,
      updated_at: subCategory.updated_at,
      deleted_at: subCategory.deleted_at,
    };
  },

  getListSubCategory: async (query: SubCategoryListRequestDto) => {
    const parsed = parseListRequest(query);
    const isActive = typeof query.is_active === 'string' 
      ? query.is_active === 'true' 
      : query.is_active;

    const where: Prisma.SubCategoryWhereInput = {
      is_active: isActive || true,
      name: parsed.q ? { contains: parsed.q, mode: 'insensitive' as const } : undefined,
      deleted_at: null,
    };

    const [list, total] = await Promise.all([
      prisma.subCategory.findMany({
        where,
        skip: parsed.skip,
        take: parsed.per_page,
        orderBy: parsed.sort_by ? { [parsed.sort_by]: parsed.sort_order } : { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          category_id: true,
          description: true,
          is_active: true,
          category: {
            select: {
              name: true,
            }
          }
        }
      }),
      prisma.subCategory.count({ where })
    ]);

    const mappedList = list.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      category_id: item.category_id,
      category_name: item.category.name,
      is_active: item.is_active,
    }));

    return {
      list: mappedList,
      meta: {
        page: parsed.page,
        per_page: parsed.per_page,
        total,
      }
    };
  },

  getAllSubCategory: async (query?: SubCategoryGetAllDto) => {
    const where: Prisma.SubCategoryWhereInput = query?.q
      ? { name: { contains: query.q, mode: 'insensitive' as const }, deleted_at: null }
      : { deleted_at: null };
    
    const list = await prisma.subCategory.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category_id: true,
        is_active: true,
        category: {
          select: {
            name: true,
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return list.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      category_id: item.category_id,
      category_name: item.category.name,
      is_active: item.is_active,
    }));
  },

  getSubCategoryById: async (id: string): Promise<SubCategoryResponseDto> => {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id, deleted_at: null },
      select: {
        id: true,
        name: true,
        description: true,
        category_id: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        category: {
          select: {
            name: true,
          }
        }
      },
    });
    if (!subCategory) {
      throw new Error('Sub-category not found');
    }
    return {
      id: subCategory.id,
      name: subCategory.name,
      description: subCategory.description,
      category_id: subCategory.category_id,
      category_name: subCategory.category.name,
      is_active: subCategory.is_active,
      created_at: subCategory.created_at,
      updated_at: subCategory.updated_at,
      deleted_at: subCategory.deleted_at,
    };
  },

  toggleStatusSubCategory: async (id: string): Promise<SubCategoryResponseDto> => {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id, deleted_at: null },
      select: {
        id: true,
        is_active: true,
      },
    });
    if (!subCategory) {
      throw new Error('Sub-category not found');
    }
    const subCategoryUpdated = await prisma.subCategory.update({
      where: { id },
      data: { is_active: !subCategory.is_active },
      select: {
        id: true,
        name: true,
        description: true,
        category_id: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        category: {
          select: {
            name: true,
          }
        }
      },
    });

    return {
      id: subCategoryUpdated.id,
      name: subCategoryUpdated.name,
      description: subCategoryUpdated.description,
      category_id: subCategoryUpdated.category_id,
      category_name: subCategoryUpdated.category.name,
      is_active: subCategoryUpdated.is_active,
      created_at: subCategoryUpdated.created_at,
      updated_at: subCategoryUpdated.updated_at,
      deleted_at: subCategoryUpdated.deleted_at,
    };
  },

  deleteSubCategory: async (id: string) => {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id, deleted_at: null },
      select: {
        id: true,
        name: true,
        is_active: true,
      },
    });
    if (!subCategory) {
      throw new Error('Sub-category not found');
    }
    return prisma.subCategory.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
};