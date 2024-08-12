import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  coord: {
    lat: number;
    lon: number;
}
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

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    //build the query string using the city name and the api key
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(this.cityName)}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  //fetch the location data using the query string
  private async fetchLocationData(): Promise<any> {
    const query = this.buildGeocodeQuery(); // Declare the query variable
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const locationData = await response.json();
    return locationData;
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(response: any): Coordinates {}
  //destructure the location data to get the lat and lon properties
  private async destructureLocationData(): Promise<Coordinates> {
    const [locationData] = await this.fetchLocationData();
    const lat = coordinates.coord.lat;
    const lon = coordinates.coord.lon;
    return { coord: { lat, lon } };
  }   


  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  //use lat and lon to get 5 day weather forecast at https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_key
  private buildWeatherQuery(coordinates: Coordinates): string {
    const lat = coordinates.coord.lat;
    const lon = coordinates.coord.lon;

    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  //fetch the location data using the city name and destructure it to get the lat and lon properties
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
      this.buildGeocodeQuery();
      await this.fetchLocationData();
      return this.destructureLocationData();
  }

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  //fetch current weather data using the coordinates
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    console.log(query);
    const response = await fetch(query);
    console.log(response);
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  //parse the current weather data from the response object and return a Weather object for the current weather

  private parseCurrentWeather(response: any): Weather {
    const cityName = response.city.name;;
    const date = response.dt_txt;
    const tempF = response.main.temp;
    const icon = response.weather[0].icon;
    const iconDescription = response.weather[0].description;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;

    return new Weather(cityName, date, tempF, icon, iconDescription, windSpeed, humidity);
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  //build a 5 day forecast array using the current weather and the weather data array from the response object and return an array of Weather objects
  private buildForecastArray(_: Weather, weatherData: any): Weather[] {
    const forecast: Weather[] = [];
    const daysAdded = new Set<any>();

    for (const data of weatherData) {
      const date = data.dt_txt.split(' ')[0]; //takes out date from the string
      if (!daysAdded.has(date)) {
        const cityName = data.city.name;
        const icon = data.weather[0].icon;
        const iconDescription = data.weather[0].description;
        const tempF = data.main.temp;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;

        forecast.push(new Weather(cityName, date, icon, iconDescription, tempF, windSpeed, humidity));
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
    weatherService.setCityName(city);
    const coordinates = await weatherService.fetchAndDestructureLocationData();
    const currentWeather = await weatherService.fetchWeatherData(coordinates);
    const weather = weatherService.parseCurrentWeather(currentWeather);
    const forecast = weatherService.buildForecastArray(weather, currentWeather);
    return [weather, ...forecast];
  }
}

export default WeatherService;
