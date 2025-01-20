import { Router } from "express";
import dataGrid, { viewCar } from "../Controller/car.js";
import { searchCar } from '../Controller/search.js';
import { filter } from "../Controller/filter.js";

const router = Router();
router.get("/car", dataGrid);
router.get("/search",searchCar)
router.get("/car/:id", viewCar)
router.get("/filter",filter)

export default router;
