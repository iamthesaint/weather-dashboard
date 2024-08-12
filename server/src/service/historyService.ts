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
// HistoryService should have methods to read, write, get, add, and remove cities from the searchHistory.json file
// TODO: Define a read method that reads from the searchHistory.json file
// private async read() {}
// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
// private async write(cities: City[]) {}
class HistoryService {
  private searchHistory: City[] = [];
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.loadHistory();
  }

  private loadHistory() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.searchHistory = JSON.parse(data);
    }
  }

  private saveHistory() {
    const data = JSON.stringify(this.searchHistory);
    fs.writeFileSync(this.filePath, data);
  }

  public addSearch(city: string) {
    const newCity = new City(city);
    this.searchHistory.push(newCity);
    this.saveHistory();
  }

  async getCities() {
    return this.searchHistory;
  }

  async removeCity(id: string) {
    this.searchHistory = this.searchHistory.filter(city => city.id !== id);
    this.saveHistory();
  }
}

export default new HistoryService('searchHistory.json');

  // TODO Define an addCity method that adds a city to the searchHistory.json file

  //add uuid
  //get all cities, add the new city, and write the updated cities to the searchHistory.json file, then return the new city


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  // read the cities from searchHistory.json
  // use the uuid to filter out the city from the cities array

  //remove the city from the cities array
