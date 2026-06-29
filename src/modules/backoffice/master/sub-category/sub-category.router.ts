import { Router } from "express";
import { SubCategoryController } from "./sub-category.controller";

export function SubCategoryRouter(): Router {
    const router = Router();

    router.post("/", SubCategoryController.createSubCategory);
    router.get("/", SubCategoryController.getListSubCategory);
    router.get("/all", SubCategoryController.getAllSubCategory);
    router.get("/:id", SubCategoryController.getSubCategoryById);
    router.put("/:id", SubCategoryController.updateSubCategory);
    router.patch("/:id/status", SubCategoryController.toggleStatusSubCategory);
    router.delete('/:id', SubCategoryController.deleteSubCategory)

    return router;
}