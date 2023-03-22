import { Prop } from '@nestjs/mongoose';
import { Temperature } from '../enum/post.Temperature';
import { WeatherInfo } from '../enum/post.weatherInfo';

export class Weather {
  constructor(weather?: WeatherInfo, temperature?: Temperature) {
    if (weather) this.weather = weather;
    if (temperature) this.temperature = temperature;
  }

  weather: WeatherInfo = null;
  temperature: Temperature = null;
}

export function WeatherDeserialization(deserial: object): Weather {
  if (deserial == undefined) return new Weather();
  const result = new Weather();
  if (deserial['weather']) result.weather = deserial['weather'];
  if (deserial['temperature']) result.temperature = deserial['temperature'];

  return result;
}
