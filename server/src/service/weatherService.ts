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
    public date: string,
    public icon: string,
    public description: string,
    public temp: number,
    public humidity: number,
    public windSpeed: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
// weatherService should have methods to fetch location data, fetch weather data, and get weather for a city
class WeatherService {
  constructor() {
    this.fetchLocationData = this.fetchLocationData.bind(this);
    this.destructureLocationData = this.destructureLocationData.bind(this);
    this.buildGeocodeQuery = this.buildGeocodeQuery.bind(this);
    this.buildWeatherQuery = this.buildWeatherQuery.bind(this);
    this.fetchAndDestructureLocationData = this.fetchAndDestructureLocationData.bind(this);
    this.fetchWeatherData = this.fetchWeatherData.bind(this);
    this.parseCurrentWeather = this.parseCurrentWeather.bind(this);
    this.buildForecastArray = this.buildForecastArray.bind(this);
    this.getWeatherForCity = this.getWeatherForCity.bind(this);
  }
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.WEATHER_API_KEY;
  private cityName = '';

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/weather?q=${this.cityName}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
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
    const { name, dt, weather, main, wind } = response.current;
    const { icon, description } = weather[0];
    const { temp, humidity } = main;
    const { speed } = wind;
    return new Weather(name, dt, icon, description, temp, humidity, speed);
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((day: any) => {
      const { dt, weather, temp } = day;
      const { icon, description } = weather[0];
      const { min, max } = temp;
      return {
        date: dt,
        icon,
        description,
        min,
        max,
        city: currentWeather.city,
      };
    });
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.daily);
    return { currentWeather, forecast };
  }
}

export default new WeatherService();
