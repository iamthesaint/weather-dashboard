import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
// properties: lat, lon
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
// properties: city, date, icon, description, temp, humidity, windSpeed
class Weather {

  constructor(
    public city: string,
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

  // TODO: Define the baseURL, API key, and city name properties

  private baseURL = process.env.WEATHER_API_URL || '';
  private apiKey = process.env.WEATHER_API_KEY || '';
  private cityName = '';


  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(cityName: string): string {
    return `q=${cityName}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string) {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?${query}`);
    if (!response.ok) {
      throw new Error('Unable to retrieve location data');
    }
    return response.json();
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  //destructuring the location data to get the latitude and longitude
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery(this.cityName);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any) {
    const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = response.current;
    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}

  // * check specifics of objects in the weatherData array

  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [currentWeather];
    for (const data of weatherData) {
      const date = data.dt * 1000; // Use the timestamp directly
      const tempF = data.temp.day; // Assuming temperature is in 'day' property
      const icon = data.weather[0].icon; // Assuming icon is in the first weather object
      const iconDescription = data.weather[0].description; // Assuming description is in the first weather object
      const windSpeed = data.wind_speed; // Assuming wind speed is in 'wind_speed' property
      const humidity = data.humidity; // Assuming humidity is in 'humidity' property

      const forecastWeather = new Weather(
        currentWeather.city,
        date,
        icon,
        iconDescription,
        tempF,
        windSpeed,
        humidity
      );

      forecastArray.push(forecastWeather);
    }
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<Weather[]> {
      //fetch location data for city, then destructure it
    try {
      this.cityName = city;
      //fetch coordinates for the city using the city name
      const coordinates = await this.fetchAndDestructureLocationData();
      //fetch weather data using the coordinates
      const weatherData = await this.fetchWeatherData(coordinates);
      //parse current weather from the fetched data
      const currentWeather = this.parseCurrentWeather(weatherData);
      //build the array using the current weather and fetched data
      const forecastArray = this.buildForecastArray(currentWeather, weatherData);
      //return the forecast array
      return forecastArray;
    } catch (error) {
      console.error(`Error fetching weather data for ${city}: ${error}`);
      throw error;
    }
  }
}

    export default new WeatherService();
