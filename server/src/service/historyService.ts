import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// TODO: Define a City class with name and id properties
// id properties should be unique to each city - use uuid

class City {
  constructor(
    public name: string,
    public id: string = uuidv4()) { }
}

// TODO: Complete the HistoryService class
// TODO: Define a read method that reads from the searchHistory.json file
// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
// TODO Define an addCity method that adds a city to the searchHistory.json file
//define a getCities method that returns the cities array

class HistoryService {
  constructor(private searchHistoryFile = 'searchHistory.json') {
    this.searchHistoryFile = searchHistoryFile;
  }

  read(): City[] {
    const cities = JSON.parse(fs.readFileSync(this.searchHistoryFile, 'utf8'));
    return cities;
  }

  write(cities: City[]): void {
    fs.writeFileSync(this.searchHistoryFile, JSON.stringify(cities));
  }

  addCity(cityName: string): City {
    const cities = this.read();
    const newCity = new City(cityName);
    cities.push(newCity);
    this.write(cities);
    return newCity;
  }

  removeCity(id: string): void {
    const cities = this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    this.write(updatedCities);
  }

  getCities(): City[] {
    return this.read();
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  // read the cities from searchHistory.json
  // use the uuid to filter out the city from the cities array

  //remove the city from the cities array


}

export default new HistoryService();

