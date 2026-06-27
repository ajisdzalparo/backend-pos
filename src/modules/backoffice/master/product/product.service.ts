import { prisma } from "../../../../config/database";
import { ProductCreateDto, ProductResponseDto, ProductListRequestDto, ProductGetAllDto, ProductUpdateDto } from "./product.types";
import { parseListRequest } from "../../../../common/ApiRequestParser";
import { Prisma } from "@prisma/client";
import { ApiError } from "../../../../common/ApiError";

export const ProductService = {
  createProduct: async (data: ProductCreateDto): Promise<ProductResponseDto> => {
    const existing = await prisma.product.findFirst({
      where: { name: { equals: data.name, mode: 'insensitive' } }
    });
    if (existing) {
      throw new ApiError('Product name already exists', 400);
    }
    return prisma.product.create({
      data,
      include: {
        category: true,
        tax: true,
        sub_category: true,
        item_modifier: true,
      }
    }) as unknown as Promise<ProductResponseDto>;
  },

  getProductList: async (query: ProductListRequestDto) => {
    const parsed = parseListRequest(query);
    const isActive = typeof query.is_active === 'string' 
      ? query.is_active === 'true' 
      : query.is_active;

    const where: Prisma.ProductWhereInput = {
      is_active: isActive !== undefined ? isActive : undefined,
      category_id: query.category_id || undefined,
      sub_category_id: query.sub_category_id || undefined,
      name: parsed.q ? { contains: parsed.q, mode: 'insensitive' as const } : undefined,
    };

    const [list, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: parsed.skip,
        take: parsed.per_page,
        orderBy: parsed.sort_by ? { [parsed.sort_by]: parsed.sort_order } : { created_at: 'desc' },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            }
          },
          tax: {
            select: {
              id: true,
              name: true,
              rate: true,
            }
          },
          sub_category: {
            select: {
              id: true,
              name: true,
            }
          },
          item_modifier: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          }
        }
      }),
      prisma.product.count({ where })
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

  getAllProducts: async (query?: ProductGetAllDto) => {
    const where: Prisma.ProductWhereInput = {
      is_active: true,
      category_id: query?.category_id || undefined,
      name: query?.q ? { contains: query.q, mode: 'insensitive' as const } : undefined,
    };

    const data = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    const result = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        sku: item.sku,
        base_price: item.base_price,
      }
    })

    return result;
  },

  getProductById: async (id: string): Promise<ProductResponseDto> => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        tax: {
          select: {
            id: true,
            name: true,
            rate: true,
          }
        },
        sub_category: {
          select: {
            id: true,
            name: true,
          }
        },
        item_modifier: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      }
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product as unknown as ProductResponseDto;
  },

  updateProduct: async (id: string, data: ProductUpdateDto): Promise<ProductResponseDto> => {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError('Product not found', 404);
    }

    if (data.name && data.name.toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await prisma.product.findFirst({
        where: { name: { equals: data.name, mode: 'insensitive' } }
      });
      if (duplicate) {
        throw new ApiError('Product name already exists', 400);
      }
    }

    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        tax: true,
        sub_category: true,
        item_modifier: true,
      }
    }) as unknown as Promise<ProductResponseDto>;
  },

  toggleStatusProduct: async (id: string): Promise<ProductResponseDto> => {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        is_active: true,
      }
    });
    if (!product) {
      throw new Error('Product not found');
    }

    return prisma.product.update({
      where: { id },
      data: { is_active: !product.is_active },
    }) as unknown as Promise<ProductResponseDto>;
  },

  deleteProduct: async (id: string) => {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
      }
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return prisma.product.delete({
      where: { id },
    });
  }
};
