import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: save city to search history
// req.body.city
// router.post('/', async (req, res) => {
 
//   const cityName = req.body.city;
//   try {
//     await HistoryService.addCity(cityName);
//     res.json({ message: 'City has been added to your search history.' });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// TODO: GET search history
// get all saved cities from searchHistory.json
// localhost:3001/api/weather/history
// GET /api/weather/history - Return all saved cities as JSON
router.get('/history', async (_req, res) => {   
  const cities = await HistoryService.getCities();
  res.json(cities);
}); 

// * BONUS TODO: DELETE city from search history
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


// TODO: POST Request with city name to retrieve weather data
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

// TODO: GET weather data from city name
// req.params.city
// localhost:3001/api/weather/:city 

// router.get('/:city', async (req, res) => {
//   const cityName = req.params.city;
//   const weatherData = await WeatherService.getWeatherForCity(cityName);
//   res.json(weatherData);
// });



export default router;
