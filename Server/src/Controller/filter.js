import { Car } from "../Models/car.js";

export const filter = async (req, res) => {
  try {

    const { minPrice, maxPrice, category: Brand } = req.query;
    
    const filters = {};

    if (minPrice || maxPrice) {
      filters.PriceEuro = {$gte: Number(minPrice) ,$lte: Number(maxPrice) };
    }

    if(minPrice) {
      filters.PriceEuro = {$gte: Number(minPrice)};
    }

    if(maxPrice) {
      filters.PriceEuro = {$lte: Number(maxPrice) };
    }
    if (Brand && Brand.trim()!=='') {
      filters.Brand = new RegExp(Brand.trim(), 'i');
    }
    const filterCars = await Car.find(filters);
    res.status(200).json(filterCars);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
