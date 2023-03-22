import { Prop } from '@nestjs/mongoose';
import { Temperature } from '../enum/post.Temperature';
import { WeatherInfo } from '../enum/post.weatherInfo';

export class Weather {
  private weather: WeatherInfo;
  private temperature: Temperature;
  constructor(weather?: WeatherInfo, temperature?: Temperature) {
    if (weather) this.weather = weather;
    if (temperature) this.temperature = temperature;
  }

  serialize(): string {
    const obj = {
      from: this.weather,
      to: this.temperature,
    };
    return JSON.stringify(obj);
  }
}

export const deserializePostWeather = (target: object): Weather => {
  if (!target || target == undefined) return null;

  return new Weather(target['weather'], target['temperature']);
};
