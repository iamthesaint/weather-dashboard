import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: GET search history
// get all saved cities from searchHistory.json
// localhost:3001/api/weather/history
router.get('/history', async (_req, res) => {
  const cities = HistoryService.getCities();
  res.json(cities);
});

// TODO: save city to search history
// req.body.city
// localhost:3001/api/weather/history
router.post('/history', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'City name is required' });
    return;
  }
  try { await HistoryService.addCity(name);
  res.status(200).send({ message: 'City has been added to your search history.' });
} catch (error) {
  res.status(500).json({ message: 'Internal server error' });
}
});

// * BONUS TODO: DELETE city from search history
// req.params.id
// localhost:3001/api/weather/history/:id
router.delete('/history/:id', async (req, res) => {
  const id = req.params.id;
  HistoryService.removeCity(id);
  res.json({ message: 'This city has been deleted from your search history.' });
});


// TODO: POST Request with city name to retrieve weather data
// req.body.city
// localhost:3001/api/weather

router.post('/', async (req, res) => {
  const cityName = req.body.cityName; //access the city from the request body of the POST request via req.body
  const weatherData = await WeatherService.getWeatherForCity(cityName);
  res.json(weatherData);
});

// TODO: GET weather data from city name
// req.params.city
// localhost:3001/api/weather/:city 

router.get('/:city', async (req, res) => {
  const cityName = req.params.city;
  const weatherData = await WeatherService.getWeatherForCity(cityName);
  res.json(weatherData);
});



export default router;
