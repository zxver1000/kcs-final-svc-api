export class Location {
  constructor(
    longitude?: number,
    latitude?: number,
    countryName?: string,
    cityName?: string,
    placeName?: string,
  ) {
    if (longitude) this.longitude = longitude;
    if (latitude) this.latitude = latitude;
    if (countryName) this.countryName = countryName;
    if (placeName) this.placeName = placeName;
    if (cityName) this.cityName = cityName;
  }

  longitude: number = null;
  latitude: number = null;
  countryName: string = null;
  cityName: string = null;
  placeName: string = null;
}

export function LocationSerialization(O: Location): string {
  return JSON.stringify(O);
}

export function LocationDeserialization(deserial: object): Location {
  const result = new Location();

  if (deserial['longitude']) result.longitude = deserial['longitude'];
  if (deserial['latitude']) result.latitude = deserial['latitude'];
  if (deserial['countryName']) result.countryName = deserial['countryName'];
  if (deserial['placeName']) result.placeName = deserial['placeName'];
  if (deserial['cityName']) result.cityName = deserial['cityName'];

  return result;
}
