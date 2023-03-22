import { targetModulesByContainer } from '@nestjs/core/router/router-module';

export class Location {
  private longitude: number;
  private latitude: number;
  private countryName: string;
  private cityName: string;
  private placeName: string;

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

  serialize(): string {
    const obj = {
      longitude: this.longitude,
      latitude: this.latitude,
      countryName: this.countryName,
      cityName: this.cityName,
      placeName: this.placeName,
    };
    return JSON.stringify(obj);
  }
}

export const deserializeLocation = (target: object): Location => {
  if (!target || target == undefined) return null;

  return new Location(
    target['longitude'],
    target['latitude'],
    target['countryName'],
    target['placeName'],
    target['cityName'],
  );
};
