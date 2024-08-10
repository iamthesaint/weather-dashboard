import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
// req.body.city
// localhost:3001/api/weather
router.post('/weather', async (req, res) => {
  const city = req.body.city;
  const weather = await WeatherService.getWeatherForCity(city);
  res.json(weather);
});

// TODO: GET weather data from city name
// req.params.city
// localhost:3001/api/weather/:city
router.get('/weather/:city', async (req, res) => {
  const city = req.params.city; //access the city from the request body of the POST request
  const weather = await WeatherService.getWeatherForCity(city);
  res.json(weather);
}
);

// TODO: save city to search history
// req.body.city
// localhost:3001/api/weather/history
router.post('/history', async (req, res) => {
  const city = req.body.city;
  await HistoryService.addCity(city);
  res.json({ message: 'This city was saved to your search history!' });
});

// TODO: GET search history
// get all saved cities from searchHistory.json
// localhost:3001/api/weather/history
router.get('/history', async (_req, res) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});


// * BONUS TODO: DELETE city from search history
// req.params.id
// localhost:3001/api/weather/history/:id
router.delete('/history/:id', async (req, res) => {
  const id = req.params.id;
  await HistoryService.removeCity(id);
  res.json({ message: 'This city has been deleted from your search history.' });
});

export default router;
