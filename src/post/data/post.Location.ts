import { Type } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Double } from 'typeorm';
/*
constructor(
    longitude: Number,
    latitude: Number,
    countryName: string,
    cityName: string,
    placeName: string,
  ) {
    this.longitude = longitude;
    this.latitude = latitude;
    this.countryName = countryName;
    this.cityName = cityName;
    this.placeName = placeName;
  }
*/
export class Location {
  constructor(
    longitude?: Number,
    latitude?: Number,
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

  @Prop()
  longitude: Number = null;

  @Prop()
  latitude: Number = null;

  @Prop()
  countryName: string = null;

  @Prop()
  cityName: string = null;

  @Prop()
  placeName: string = null;
}

export function LocationSerialization(O: Location): string {
  return JSON.stringify(O);
}

export function LocationDeserialization(deserial: object): Location {
  // let deserial = JSON.parse(str);

  let return_val = new Location();
  if (deserial['longitude']) return_val.longitude = deserial['longitude'];
  if (deserial['latitude']) return_val.latitude = deserial['latitude'];
  if (deserial['countryName']) return_val.countryName = deserial['countryName'];
  if (deserial['placeName']) return_val.placeName = deserial['placeName'];
  if (deserial['cityName']) return_val.cityName = deserial['cityName'];

  return return_val;
}
