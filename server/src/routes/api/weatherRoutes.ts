import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// get all saved cities from searchHistory.json
// localhost:3001/api/weather/history
// GET /api/weather/history - Return all saved cities as JSON
router.get('/history', async (_req, res) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

// req.params.id
// localhost:3001/api/weather/history/:id
router.delete('/history/:id', async (req, res) => {

  const cityId = req.params.id;
  try {
    await HistoryService.removeCity(cityId);
    res.json({ message: 'City has been removed from your search history.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// req.body.city
// localhost:3001/api/weather

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const cityName = req.body.cityName;
    console.log(cityName);
    await HistoryService.addCity(cityName);
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    res.json(weatherData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
