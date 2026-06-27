import { Router } from "express";
import { ItemModifierController } from "./item-modifier.controller";

export function ItemModifierRouter(): Router {
    const router = Router();

    router.post("/", ItemModifierController.createItemModifier);
    router.get("/", ItemModifierController.getListItemModifier);
    router.get("/all", ItemModifierController.getAllItemModifier);
    router.get("/:id", ItemModifierController.getItemModifierById);
    router.patch("/:id/status", ItemModifierController.toggleStatusItemModifier);
    router.delete('/:id', ItemModifierController.deleteItemModifier)

    return router;
}