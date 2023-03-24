import { WeatherInfo } from '../enum/post.weatherInfo';

export class Weather {
  private weather: WeatherInfo;
  // private temperature: Temperature;
  constructor(weather?: WeatherInfo) {
    if (weather) this.weather = weather;
    // if (temperature) this.temperature = temperature;
  }

  serialize(): string {
    const obj = {
      weather: this.weather,
    };
    return JSON.stringify(obj);
  }
}

export const deserializePostWeather = (target: object): Weather => {
  if (!target) return null;

  return new Weather(target['weather']);
  // return new Weather(target['weather'], target['temperature']);
};
