import { Router } from "express";
import { CategoryController } from "./category.controller";

export function CategoryRouter(): Router {
    const router = Router();

    router.post("/", CategoryController.createCategory);
    router.get("/", CategoryController.getListCategory);
    router.get("/all", CategoryController.getAllCategory);
		router.get("/:id", CategoryController.getCategoryById);
		router.patch("/:id/status", CategoryController.toggleStatusCategory);
		router.delete('/:id', CategoryController.deleteCategory)

    return router;
}