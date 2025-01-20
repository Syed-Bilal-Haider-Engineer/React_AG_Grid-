import { Car } from '../Models/car.js';
const car = async (req, res) => {
    try {
      const cars = await Car.find();
      res.status(200).json(cars);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching car data' });
    }
  }

export const viewCar = async(req,res) => {
  const carId = req.params.id;
  try {
    const cars = await Car.findById({_id:carId});
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching car details data' });
  }
}
export default car;