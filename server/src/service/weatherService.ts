import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
// properties: lat, lon, coord
interface Coordinates {
  lat: number;
  lon: number;
  coord: {
    lat: number;
    lon: number;
  };
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
  private cityName: string = '';

  constructor(cityName: string) {
    this.cityName = cityName;
  }

  public setCityName(cityName: string): void {
    this.cityName = cityName;
  }

  public getCityName(): string {
    return this.cityName;
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  //get the city name and return the query string
  //url = https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  private buildGeocodeQuery(): string {
    if (!this.cityName) {
      throw new Error('City name is required');
  }
  if (!this.apiKey) {
      throw new Error('API key is required');
  }
    return `${this.baseURL}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  //fetch the location data using the query string
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(query);
    const locationData = await response.json();
    return locationData;
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  //get lat and lon from the location data
  private destructureLocationData(locationData: Coordinates): Coordinates 
  {
    const { lat, lon } = locationData.coord;
    return { lat, lon, coord: { lat, lon } };
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  //use lat and lon to get 5 day weather forecast at https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_key
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  //fetch the location data using the city name and destructure it to get the lat and lon properties
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
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
  //parse the current weather data from the response object and return a Weather object
  private parseCurrentWeather(response: any): Weather{
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
  //build a 5 day forecast array using the current weather and the weather data
  private buildForecastArray(_: Weather, weatherData: any): Weather[] {
    return weatherData.map((data: any) => {
      const cityName = this.cityName;
      const date = data.dt; //how to get the date from the data object?
      const icon = data.weather[0].icon;
      const iconDescription = data.weather[0].description;
      const tempF = data.main.temp; 
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
  
      return new Weather(cityName, date, icon, iconDescription, tempF, windSpeed, humidity);
    });
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
