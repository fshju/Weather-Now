export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  feelsLike: number;
  windDirection: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  moonPhase?: string;
  cloudCover?: number;
  precipitation?: number;
  lastUpdated?: string;
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
}

export interface WeatherAPIResponse {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    vis_km: number;
    feelslike_c: number;
    wind_dir: string;
    uv: number;
    air_quality?: {
      'us-epa-index': number;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      astro: {
        sunrise: string;
        sunset: string;
        moon_phase: string;
        moon_illumination: string;
      };
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
        };
        daily_chance_of_rain: number;
        maxwind_kph: number;
        uv: number;
      };
    }>;
  };
} 