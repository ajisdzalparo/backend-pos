import { Request, Response } from "express";
import { ApiUtils } from "../../../../common/ApiError";
import { ItemModifierService } from "./item-modifier.service";
import { asyncHandler } from "../../../../common/asyncHandler";

export const ItemModifierController = {
  createItemModifier: asyncHandler(async (req: Request, res: Response) => {
    const itemModifier = await ItemModifierService.createItemModifier(req.body);
    return res.status(201).json(ApiUtils.createSuccess(itemModifier, 'Item modifier created successfully'));
  }),

  getListItemModifier: asyncHandler(async (req: Request, res: Response) => {
    const result = await ItemModifierService.getListItemModifier(req.query as any);
    return res.status(200).json(ApiUtils.createSuccess(result.list, 'List Item modifier retrieved successfully', result.meta));
  }),

  getItemModifierById: asyncHandler(async (req: Request, res: Response) => {
    const itemModifier = await ItemModifierService.getItemModifierById(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(itemModifier, 'Item modifier retrieved successfully'));
  }),

  getAllItemModifier: asyncHandler(async (req: Request, res: Response) => {
    const result = await ItemModifierService.getAllItemModifier({
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
    });
    return res.status(200).json(ApiUtils.createSuccess(result, 'All Item modifiers retrieved successfully'));
  }),

  toggleStatusItemModifier: asyncHandler(async (req: Request, res: Response) => {
    const itemModifier = await ItemModifierService.toggleStatusItemModifier(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(itemModifier, 'Item modifier status toggled successfully'));
  }),

  deleteItemModifier: asyncHandler(async (req: Request, res: Response) => {
    const itemModifier = await ItemModifierService.deleteItemModifier(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(itemModifier, 'Item modifier deleted successfully'));
  }),
};