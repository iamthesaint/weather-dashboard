import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// TODO: Define a City class with name and id properties

class City {
  constructor(public name: string, public id = uuidv4()) { }
}

class HistoryService {
  private filePath = 'server/db/searchHistory.json';

  private async read(): Promise<City[]> {
    const data = await fs.promises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  private async write(cities: City[]): Promise<void> {
    await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  public async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(cityName);
    cities.push(newCity);
    this.write
    (cities).then(() => console.log('City has been added to your search history.'));
  }

  public async getCities(): Promise<City[]> {
    return this.read();
  }

  public async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);
    this.write(updatedCities);
  }
}
  export default new HistoryService;



  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file