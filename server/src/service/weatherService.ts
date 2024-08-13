import dotenv from 'dotenv';
import 'express';
dotenv.config();
import fetch from 'node-fetch';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}


// TODO: Define a class for the Weather object
// properties: city, date, icon, description, temp, humidity, windSpeed
class Weather {
  constructor(
    public city: string,
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
  ) { }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL = process.env.API_BASE_URL || '';
  private apiKey = process.env.API_KEY || '';  
  private cityName: string; //city name to search for

  constructor(cityName: string) {
    this.cityName = cityName || '';
    console.log('API Base URL:', this.baseURL);
    console.log('API Key:', this.apiKey);
  }

  public setCityName(cityName: string): void {
    this.cityName = cityName;
  }

  public getCityName(): string {
    return this.cityName;
  }

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  //fetch the location data using the query string
  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}/weather?q=${encodeURIComponent(query)}&appid=${this.apiKey}`;
    console.log('URL:', url);
    const response = await fetch(url);
    console.log('Response:', response.status, response.statusText);
    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(response: any): Coordinates {}
  //destructure the location data to get the lat and lon properties

  private destructureLocationData(response: any): Coordinates {
      const { coord: { lat, lon } } = response;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return { lat, lon };
    } 

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  //use lat and lon to get 5 day weather forecast at https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_key}
  private buildWeatherQuery(lat: number, lon: number): string {
    const baseURL = process.env.API_BASE_URL || '';
    const apiKey = process.env.API_KEY || '';
    return `${baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  }

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const { lat, lon } = coordinates;
    const url = this.buildWeatherQuery(lat, lon);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }


  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  //parse the current weather data from the response object and return a Weather object for the current weather

  private parseCurrentWeather(response: any): Weather {
    // console.log('API Response:', JSON.stringify(response, null, 2));
    const cityName = response.city.name;
    const date = new Date(response.list[0].dt * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  }); // format the date    console.log('Date:', date);
    const tempK = response.list[0].main.temp; //temperature in Kelvin
    const temp = Math.round((tempK - 273.15) * 9/5 + 32);
    const icon = response.list[0].weather[0].icon;
    const iconDescription = response.list[0].weather[0].description;
    const windSpeed = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;
    const currentWeather = new Weather(cityName, date.toString(), icon, iconDescription, temp, windSpeed, humidity);
    return currentWeather;
  }
  

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  //build a 5 day forecast array using the current weather and the weather data array from the response object and return an array of Weather objects
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast: Weather[] = [];
    const daysAdded = new Set<string>();

    for (const data of weatherData) {
      const date = data.dt_txt.split(' ')[0]; //takes date from string
      if (!daysAdded.has(date) && date !== currentWeather.date) { //starts forecast from the next day
        const cityName = currentWeather.city;
        const { icon, description: iconDescription } = data.weather[0];
        const tempK = data.main.temp; // temperature in Kelvin
        const temp = Math.round((tempK - 273.15) * 9/5 + 32);
        console.log('Temp:', temp);
        const { humidity } = data.main;
        const { speed: windSpeed } = data.wind;
        
        forecast.push(new Weather(cityName, date, icon, iconDescription, temp, windSpeed, humidity));
        daysAdded.add(date);

        if (forecast.length === 5) {
          break;
        }
      }
      console.log('Date:', date);
      if (!daysAdded.has(date)) {
        const cityName = currentWeather.city;
        const { icon, description: iconDescription } = data.weather[0];
        const tempK = data.main.temp; // temperature in Kelvin
        const temp = Math.round((tempK - 273.15) * 9/5 + 32);
        console.log('Temp:', temp);
        const { humidity } = data.main;
        const { speed: windSpeed } = data.wind;
        
        forecast.push(new Weather(cityName, date, icon, iconDescription, temp, windSpeed, humidity));
        daysAdded.add(date);

        if (forecast.length === 5) {
          break;
        }
      }
    }
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  // static async getWeatherForCity(city: string): Promise<Weather[]> {}
  //get the current weather and 5 day forecast for the input city

  static async getWeatherForCity(city: string): Promise<Weather[]> {
    const weatherService = new WeatherService(city);
    const locationData = await weatherService.fetchLocationData(city);
    const coordinates = weatherService.destructureLocationData(locationData);
    const weatherData = await weatherService.fetchWeatherData(coordinates);
    const currentWeather = weatherService.parseCurrentWeather(weatherData);
    const forecast = weatherService.buildForecastArray(currentWeather, weatherData.list);
    console.log('Current Weather:', currentWeather);
    return [currentWeather, ...forecast];
  }
}


export default WeatherService;
