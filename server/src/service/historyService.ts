import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

class City {
  id: string = '';
  name: string = '';
}

class HistoryService {
  private filePath = 'db/searchHistory.json';

  //get all cities from searchHistory.json to display on the front end 
  public async getCities(): Promise<City[]> {
    try {
      return await this.read();
    }
    catch (err) {
      console.error('Error getting cities:', err);
      return [];
    }
  }

  // Read searchHistory.json to see if the city is already in the search history
  async read(): Promise<City[]> {
    try {
      console.log(process.cwd());
      if (!fs.existsSync(this.filePath)) {
        await fs.promises.writeFile(this.filePath, JSON.stringify([]));
      }
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading cities:', err);
      throw err;
    }
  }

  // Write the city to searchHistory.json
  async write(cities: City[]): Promise<void> {
    return fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  // Add city to search history if it is not already there
  public async addCity(cityName: string): Promise<void> {
    try {
      const cities = await this.read();
      if (!cities.some((city) => city.name === cityName)) {
        const newCity: City = { id: uuidv4(), name: cityName };
        cities.push(newCity);
        await this.write(cities);
      }
    } catch (err) {
      console.error('Error adding city:', err);
    }
  }

  //remove city from search history if user clicks the delete button on the front end
  public async removeCity(cityId: string): Promise<void> {
    try {
      const cities = await this.read();
      const updatedCities = cities.filter((city) => city.id !== cityId);
      await this.write(updatedCities);
    }
    catch (err) {
      console.error('Error removing city:', err);
    }
  }
}

export default new HistoryService;