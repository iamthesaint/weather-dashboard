import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises';

// TODO: Define a City class with name and id properties
// id properties should be unique to each city - use uuid

class City {
  constructor(
    public name: string,
    public id: string = uuidv4()) {}
}

// TODO: Complete the HistoryService class
// HistoryService should have methods to read, write, get, add, and remove cities from the searchHistory.json file
// TODO: Define a read method that reads from the searchHistory.json file
// private async read() {}
// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
// private async write(cities: City[]) {}
class HistoryService {

  private async read() {
      return await fs.readFile('db/searchHistory.json', 'utf-8');
  }

  private async write(cities: City[]): Promise<void> {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, 2));
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
    //read cities from searchHistory.json
    //parse the cities
    //return the cities as an array of City objects or an empty array if there are no cities
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (error) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // use uuid to generate a unique id for each city
  async addCity(city: string) {
    if (!city) {
      throw new Error('City name is required');
  }

  //add uuid
  const newCity: City = { name: city, id: uuidv4() };

  //get all cities, add the new city, and write the updated cities to the searchHistory.json file, then return the new city
  return await this.getCities()
      .then((cities) => {
          if (cities.find((index) => index.name === city)) {
              return cities;
          }
          return [...cities, newCity];
        })
        .then((updatedCities) => this.write(updatedCities))
        .then(() => newCity);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  // read the cities from searchHistory.json
  // use the uuid to filter out the city from the cities array
  async removeCity(id: string) {
    return await this.getCities()
    .then((cities) => cities.filter((city) => city.id !== id))
    .then((filteredCities) => this.write(filteredCities));
  }
}
export default new HistoryService();
