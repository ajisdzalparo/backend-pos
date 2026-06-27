import { Router } from "express";
import { TaxRouter } from "./tax/tax.router";
import { CategoryRouter } from "./category/category.router";
import { SubCategoryRouter } from "./sub-category/sub-category.router";
import { ItemModifierRouter } from "./item-modifier/item-modifier.router";
import { ProductRouter } from "./product/product.router";

export function MasterRouter(): Router {
    const router = Router();

    router.use("/master/tax", TaxRouter());
    router.use("/master/category", CategoryRouter());
    router.use("/master/sub-category", SubCategoryRouter());
    router.use("/master/item-modifier", ItemModifierRouter());
    router.use("/master/product", ProductRouter());

    return router;
}
