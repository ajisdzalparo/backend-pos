import { Request, Response } from "express";
import { ApiUtils } from "../../../../common/ApiError";
import { CategoryService } from "./category.service";
import { asyncHandler } from "../../../../common/asyncHandler";

export const CategoryController = {
  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const Category = await CategoryService.createCategory(req.body);
    return res.status(201).json(ApiUtils.createSuccess(Category, 'Category created successfully'));
  }),

  getListCategory: asyncHandler(async (req: Request, res: Response) => {
    const result = await CategoryService.getListCategory(req.query);
    return res.status(200).json(ApiUtils.createSuccess(result.list, 'List Category retrieved successfully', result.meta));
  }),

  getCategoryById: asyncHandler(async (req: Request, res: Response) => {
    const Category = await CategoryService.getCategoryById(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(Category, 'Category retrieved successfully'));
  }),

  getAllCategory: asyncHandler(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategory({
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
    });
    return res.status(200).json(ApiUtils.createSuccess(result, 'All Category retrieved successfully'));
  }),

	toggleStatusCategory: asyncHandler(async (req: Request, res: Response) => {
		const Category = await CategoryService.toggleStatusCategory(req.params.id);
		return res.status(200).json(ApiUtils.createSuccess(Category, 'Category status toggled successfully'));
	}),

	deleteCategory: asyncHandler(async (req: Request, res: Response) => {
		const Category = await CategoryService.deleteCategory(req.params.id);
		return res.status(200).json(ApiUtils.createSuccess(Category, 'Category deleted successfully'));
	}),
};