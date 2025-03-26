import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

router.use(protect); // Protected routes below
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
