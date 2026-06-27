import { Request, Response } from "express";
import { ApiUtils } from "../../../../common/ApiError";
import { SubCategoryService } from "./sub-category.service";
import { asyncHandler } from "../../../../common/asyncHandler";

export const SubCategoryController = {
  createSubCategory: asyncHandler(async (req: Request, res: Response) => {
    const subCategory = await SubCategoryService.createSubCategory(req.body);
    return res.status(201).json(ApiUtils.createSuccess(subCategory, 'Sub-category created successfully'));
  }),

  getListSubCategory: asyncHandler(async (req: Request, res: Response) => {
    const result = await SubCategoryService.getListSubCategory(req.query as any);
    return res.status(200).json(ApiUtils.createSuccess(result.list, 'List Sub-category retrieved successfully', result.meta));
  }),

  getSubCategoryById: asyncHandler(async (req: Request, res: Response) => {
    const subCategory = await SubCategoryService.getSubCategoryById(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(subCategory, 'Sub-category retrieved successfully'));
  }),

  getAllSubCategory: asyncHandler(async (req: Request, res: Response) => {
    const result = await SubCategoryService.getAllSubCategory({
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
    });
    return res.status(200).json(ApiUtils.createSuccess(result, 'All Sub-categories retrieved successfully'));
  }),

  toggleStatusSubCategory: asyncHandler(async (req: Request, res: Response) => {
    const subCategory = await SubCategoryService.toggleStatusSubCategory(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(subCategory, 'Sub-category status toggled successfully'));
  }),

  deleteSubCategory: asyncHandler(async (req: Request, res: Response) => {
    const subCategory = await SubCategoryService.deleteSubCategory(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(subCategory, 'Sub-category deleted successfully'));
  }),
};