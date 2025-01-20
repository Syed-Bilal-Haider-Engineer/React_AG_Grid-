import { Car } from "../Models/car.js";

export const searchCar = async (req, res) => {
    try {
      const searchQuery = req.query.q || "";
      const cars = await Car.find({
        $or: [
            { Brand: { $regex: searchQuery, $options: "i" } },
            { Model: { $regex: searchQuery, $options: "i" } },
            { RapidCharge: { $regex: searchQuery, $options: "i" } },
            { PowerTrain: { $regex: searchQuery, $options: "i" } },
            { PlugType: { $regex: searchQuery, $options: "i" } },
            { BodyStyle: { $regex: searchQuery, $options: "i" } },
            { Segment: { $regex: searchQuery, $options: "i" } },
          ],
      });
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Error fetching data" });
    }
  };