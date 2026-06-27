import { Router } from "express";
import { TaxRouter } from "./tax/tax.router";
import { CategoryRouter } from "./category/category.router";


export function MasterRouter(): Router {
    const router = Router();

    router.use("/master/tax", TaxRouter());
		router.use("/master/category", CategoryRouter());

    return router;
}
