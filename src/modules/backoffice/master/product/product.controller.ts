import { Request, Response } from "express";
import { ApiUtils } from "../../../../common/ApiError";
import { ProductService } from "./product.service";
import { asyncHandler } from "../../../../common/asyncHandler";

export const ProductController = {
  createProduct: asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.createProduct(req.body);
    return res.status(201).json(ApiUtils.createSuccess(product, 'Product created successfully'));
  }),

  getProductList: asyncHandler(async (req: Request, res: Response) => {
    const result = await ProductService.getProductList(req.query as any);
    return res.status(200).json(ApiUtils.createSuccess(result.list, 'List Product retrieved successfully', result.meta));
  }),

  getAllProducts: asyncHandler(async (req: Request, res: Response) => {
    const result = await ProductService.getAllProducts({
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      category_id: typeof req.query.category_id === 'string' ? req.query.category_id : undefined,
    });
    return res.status(200).json(ApiUtils.createSuccess(result, 'All Products retrieved successfully'));
  }),

  getProductById: asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.getProductById(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(product, 'Product retrieved successfully'));
  }),

  updateProduct: asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    return res.status(200).json(ApiUtils.createSuccess(product, 'Product updated successfully'));
  }),

  toggleStatusProduct: asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.toggleStatusProduct(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(product, 'Product status toggled successfully'));
  }),

  deleteProduct: asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.deleteProduct(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(product, 'Product deleted successfully'));
  }),
};
