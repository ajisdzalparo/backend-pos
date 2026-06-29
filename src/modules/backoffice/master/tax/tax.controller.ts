import { Request, Response } from "express";
import { ApiUtils } from "../../../../common/ApiError";
import { TaxService } from "./tax.service";
import { asyncHandler } from "../../../../common/asyncHandler";

export const TaxController = {
  createTax: asyncHandler(async (req: Request, res: Response) => {
    const tax = await TaxService.createTax(req.body);
    return res.status(201).json(ApiUtils.createSuccess(tax, 'Tax created successfully'));
  }),

  getTaxList: asyncHandler(async (req: Request, res: Response) => {
    const result = await TaxService.getListTax(req.query);
    return res.status(200).json(ApiUtils.createSuccess(result.list, 'List tax retrieved successfully', result.meta));
  }),

  getTaxById: asyncHandler(async (req: Request, res: Response) => {
    const tax = await TaxService.getTaxById(req.params.id);
    return res.status(200).json(ApiUtils.createSuccess(tax, 'Tax retrieved successfully'));
  }),

  getAllTax: asyncHandler(async (req: Request, res: Response) => {
    const result = await TaxService.getAllTax({
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
    });
    return res.status(200).json(ApiUtils.createSuccess(result, 'All tax retrieved successfully'));
  }),

  updateTax: asyncHandler(async (req: Request, res: Response) => {
    const tax = await TaxService.updateTax(req.params.id, req.body);
    return res.status(200).json(ApiUtils.createSuccess(tax, 'Tax updated successfully'));
  }),

	toggleStatus: asyncHandler(async (req: Request, res: Response) => {
		const tax = await TaxService.toggleStatusTax(req.params.id);
		return res.status(200).json(ApiUtils.createSuccess(tax, 'Tax status toggled successfully'));
	}),

	deleteTax: asyncHandler(async (req: Request, res: Response) => {
		const tax = await TaxService.deleteTax(req.params.id);
		return res.status(200).json(ApiUtils.createSuccess(tax, 'Tax deleted successfully'));
	}),
};