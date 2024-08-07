import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
// req.body.city
router.post('/weather', async (req, res) => {
  const city = req.body.city;
  const weather = await WeatherService.getWeatherForCity(city);
  res.json(weather)
});

// TODO: GET weather data from city name
// req.params.city
router.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const weather = await WeatherService.getWeatherForCity(city);
  res.json(weather);
});

// TODO: save city to search history
// req.body.city
router.post('/history', async (req, res) => {
  const city = req.body.city;
  await HistoryService.addCity(city);
  res.json({ message: 'This city was saved to your search history!' });
});

// TODO: GET search history
// get all saved cities from searchHistory.json
router.get('/history', async (req, res) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});


// * BONUS TODO: DELETE city from search history
// req.params.id
router.delete('/history/:id', async (req, res) => {
  const id = req.params.id;
  await HistoryService.removeCity(id);
  res.json({ message: 'This city has been deleted from your search history.' });
});

export default router;
