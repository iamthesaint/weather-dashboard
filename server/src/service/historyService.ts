import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

// TODO: Define a City class with name and id properties
// id properties should be unique to each city - use uuid

class City {
  constructor(
    public name: string,
    public id: string = uuidv4()
  ) {}
}

// TODO: Complete the HistoryService class
// TODO: Define a read method that reads from the searchHistory.json file
// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
// TODO Define an addCity method that adds a city to the searchHistory.json file
//define a getCities method that returns the cities array

class HistoryService {
  private searchHistoryFile: string;

  constructor() {
    this.searchHistoryFile = 'searchHistory.json';
  }

  private async read(): Promise<City[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.searchHistoryFile, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  private async write(cities: City[]): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.searchHistoryFile, JSON.stringify(cities, null, 2), 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async addCity(name: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(name);
    cities.push(newCity);
    await this.write(cities);
  }

  public async getCities(): Promise<City[]> {
    return this.read();
  }

  public async removeCity(id: string): Promise<void> {
    const cities = this.read();
    const updatedCities = (await cities).filter(city => city.id !== id);
    this.write(updatedCities);
  }


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  // read the cities from searchHistory.json
  // use the uuid to filter out the city from the cities array

  //remove the city from the cities array


}

export default new HistoryService;
