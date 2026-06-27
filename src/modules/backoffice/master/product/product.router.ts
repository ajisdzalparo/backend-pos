import { Router } from "express";
import { ProductController } from "./product.controller";

export function ProductRouter(): Router {
    const router = Router();

    router.post("/", ProductController.createProduct);
    router.get("/", ProductController.getProductList);
    router.get("/all", ProductController.getAllProducts);
    router.get("/:id", ProductController.getProductById);
    router.put("/:id", ProductController.updateProduct);
    router.patch("/:id/status", ProductController.toggleStatusProduct);
    router.delete("/:id", ProductController.deleteProduct);

    return router;
}
