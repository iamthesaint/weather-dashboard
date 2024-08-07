import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
// id properties should be unique to each city - use uuid

class City {
  constructor(public name: string, public id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
// HistoryService should have methods to read, write, get, add, and remove cities from the searchHistory.json file
class HistoryService {
  constructor() {
    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
    this.getCities = this.getCities.bind(this);
    this.addCity = this.addCity.bind(this);
    this.removeCity = this.removeCity.bind(this);
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read () {
    const fs = require('fs');
    const cities = fs.readFileSync('searchHistory.json', 'utf8');
    return JSON.parse(cities);
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write (cities: City[]) {
    const fs = require('fs');
    fs.writeFileSync('searchHistory.json', JSON.stringify(cities));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities () {
    const cities = await this.read();
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // use uuid to generate a unique id for each city
  async addCity (city: string) {
    const cities = await this.read();
    const cityId = uuidv4();
    cities.push(new City(city, cityId));
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  // read the cities from searchHistory.json
  // use the uuid to filter out the city from the cities array
  async removeCity (id: string) {
      const cities = await this.read();
      const newCities = cities.filter((city: City) => city.id !== id);
      await this.write(newCities);
  }
}

export default new HistoryService();
