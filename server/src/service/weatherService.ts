import dotenv from 'dotenv';
import 'express';
dotenv.config();
import fetch from 'node-fetch';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

interface WeatherResponse {
  city: {
    name: string;
  };
  list: {
    dt_txt: any;
    main: {
      temp: number;
      humidity: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
    wind: {
      speed: number;
    };
  }[];
}


// TODO: Define a class for the Weather object
// properties: city, date, icon, description, temp, humidity, windSpeed
class Weather {
  constructor(
    public cityName: string,
    public date: number,
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
    try {
      const response = await fetch(`${this.baseURL}/weather?q=${query}&appid=${this.apiKey}`);
      const data = await response.json();
      if (!(data as any).coord) {
        throw new Error('Invalid location data received from API');
      }
      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(response: any): Coordinates {}
  //destructure the location data to get the lat and lon properties

  private destructureLocationData(coordinates: Coordinates) {
    const { lat, lon } = coordinates;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    return { lat, lon };
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  //use lat and lon to get 5 day weather forecast at https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_key}
  private buildWeatherQuery(lat: number, lon: number): string {
    return `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  //fetch current weather data using the coordinates
  private async fetchWeatherData(): Promise<any> {
    try {
      const locationData = await this.fetchLocationData(this.cityName);
      const { lat, lon } = this.destructureLocationData(locationData.coord);
      const weatherQueryURL = this.buildWeatherQuery(lat, lon);
      const response = await fetch(weatherQueryURL);
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  //parse the current weather data from the response object and return a Weather object for the current weather

  private parseCurrentWeather(response: WeatherResponse): Weather {
    console.log('API Response:', response);
  
    const cityName = response.city.name;
    const date = response.list[0].dt_txt;
    const tempF = response.list[0].main.temp;
    const icon = response.list[0].weather[0].icon;
    const iconDescription = response.list[0].weather[0].description;
    const windSpeed = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;
  
    return new Weather(cityName, date.toString(), icon, iconDescription, tempF, windSpeed, humidity);
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  //build a 5 day forecast array using the current weather and the weather data array from the response object and return an array of Weather objects
  private buildForecastArray(currentWeather: Weather, weatherData: WeatherResponse['list']): Weather[] {
    const forecast: Weather[] = [];
    const daysAdded = new Set<any>();

    console.log('Weather Data:', weatherData);
    for (const data of weatherData) {
      const date = data.dt_txt.split(' ')[0]; //takes out date from the string
      if (!daysAdded.has(date)) {
        const cityName = currentWeather.cityName; // Use cityName from currentWeather
        const icon = data.weather[0].icon;
        const iconDescription = data.weather[0].description;
        const tempF = data.main.temp;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;

        forecast.push(new Weather(cityName, date, icon, iconDescription, tempF, windSpeed, humidity));
        daysAdded.add(date);

        if (forecast.length === 6) {
          break;
        }
      }
    }
    return forecast;
  }

  private async getWeatherForecast(): Promise<any> {
    try {
      const locationData = await this.fetchLocationData(this.cityName);
      const { lat, lon } = this.destructureLocationData(locationData.coord);
      const weatherQueryURL = this.buildWeatherQuery(lat, lon);
      const response = await fetch(weatherQueryURL);
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }

  // TODO: Complete getWeatherForCity method
  // static async getWeatherForCity(city: string): Promise<Weather[]> {}
  //get the current weather and 5 day forecast for the input city
  static async getWeatherForCity(city: string): Promise<Weather[]> {
    const weatherService = new WeatherService(city);
    weatherService.fetchWeatherData();
    const weatherData = await weatherService.getWeatherForecast();
    const currentWeather = weatherService.parseCurrentWeather(weatherData);
    const forecast = weatherService.buildForecastArray(currentWeather, weatherData.list);
    return [currentWeather, ...forecast];
  }
}


export default WeatherService;
