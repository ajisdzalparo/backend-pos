import { prisma } from "../../../../config/database";
import { ItemModifierCreateDto, ItemModifierResponseDto, ItemModifierListRequestDto, ItemModifierGetAllDto } from "./item-modifier.types";
import { parseListRequest } from "../../../../common/ApiRequestParser";
import { Prisma } from "@prisma/client";

export const ItemModifierService = {
  createItemModifier: async (data: ItemModifierCreateDto): Promise<ItemModifierResponseDto> => {
    const { product_ids, ...rest } = data;
    return prisma.itemModifier.create({
      data: {
        ...rest,
        products: product_ids && product_ids.length > 0 ? {
          connect: product_ids.map(id => ({ id }))
        } : undefined
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
          }
        }
      }
    }) as unknown as Promise<ItemModifierResponseDto>;
  },

  getListItemModifier: async (query: ItemModifierListRequestDto) => {
    const parsed = parseListRequest(query);
    const isActive = typeof query.is_active === 'string' 
      ? query.is_active === 'true' 
      : query.is_active;

    const where: Prisma.ItemModifierWhereInput = {
      is_active: isActive || true,
      name: parsed.q ? { contains: parsed.q, mode: 'insensitive' as const } : undefined,
      deleted_at: null,
    };

    const [list, total] = await Promise.all([
      prisma.itemModifier.findMany({
        where,
        skip: parsed.skip,
        take: parsed.per_page,
        orderBy: parsed.sort_by ? { [parsed.sort_by]: parsed.sort_order } : { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          price: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          products: {
            select: {
              id: true,
              name: true,
              sku: true,
            }
          }
        }
      }),
      prisma.itemModifier.count({ where })
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

  getAllItemModifier: async (query?: ItemModifierGetAllDto) => {
    const where: Prisma.ItemModifierWhereInput = query?.q
      ? { name: { contains: query.q, mode: 'insensitive' as const }, deleted_at: null }
      : { deleted_at: null };
    
    return prisma.itemModifier.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        is_active: true,
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  },

  getItemModifierById: async (id: string): Promise<ItemModifierResponseDto> => {
    const itemModifier = await prisma.itemModifier.findUnique({
      where: { id, deleted_at: null },
      select: {
        id: true,
        name: true,
        price: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
          }
        }
      },
    });
    if (!itemModifier) {
      throw new Error('Item modifier not found');
    }
    return itemModifier as unknown as ItemModifierResponseDto;
  },

  toggleStatusItemModifier: async (id: string): Promise<ItemModifierResponseDto> => {
    const itemModifier = await prisma.itemModifier.findUnique({
      where: { id, deleted_at: null },
      select: {
        id: true,
        is_active: true,
      },
    });
    if (!itemModifier) {
      throw new Error('Item modifier not found');
    }
    return prisma.itemModifier.update({
      where: { id },
      data: { is_active: !itemModifier.is_active },
      select: {
        id: true,
        name: true,
        price: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
          }
        }
      },
    }) as unknown as Promise<ItemModifierResponseDto>;
  },

  deleteItemModifier: async (id: string) => {
    const itemModifier = await prisma.itemModifier.findUnique({
      where: { id, deleted_at: null },
      select: {
        id: true,
        name: true,
        is_active: true,
      },
    });
    if (!itemModifier) {
      throw new Error('Item modifier not found');
    }
    return prisma.itemModifier.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
};