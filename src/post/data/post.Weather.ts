import { Prop } from '@nestjs/mongoose';

export class Weather {
  constructor(weather?: WeatherInfo, temperature?: Temperature) {
    if (weather) this.weather = weather;
    if (temperature) this.temperature = temperature;
  }
  @Prop()
  weather: WeatherInfo = null;

  @Prop()
  temperature: Temperature = null;
}

export function WeatherDeserialization(deserial: Object): Weather {
  if (deserial == undefined) return new Weather();
  let return_val = new Weather();
  if (deserial['weather']) return_val.weather = deserial['weather'];
  if (deserial['temperature']) return_val.temperature = deserial['temperature'];

  return return_val;
}
