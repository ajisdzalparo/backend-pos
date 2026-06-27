import { Router } from "express";
import { TaxController } from "./tax.controller";

export function TaxRouter(): Router {
    const router = Router();

    router.post("/", TaxController.createTax);
    router.get("/", TaxController.getTaxList);
    router.get("/all", TaxController.getAllTax);
		router.get("/:id", TaxController.getTaxById);
		router.patch("/:id/status", TaxController.toggleStatus);
		router.delete('/:id', TaxController.deleteTax)

    return router;
}