"use client"
import { useState, useEffect, useCallback } from 'react';

import {
  Search,
  MapPin,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  CloudSun,
  Thermometer,
  Compass,
  Clock,
  Calendar,
} from 'lucide-react';
import type { WeatherData, ForecastDay, WeatherAPIResponse } from '@/types/weather';

const WeatherApp = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [unit] = useState<'celsius' | 'fahrenheit'>('celsius');

  const fetchWeatherByCoords = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5&aqi=yes`
      );
      const data: WeatherAPIResponse = await response.json();
      transformAndSetWeatherData(data);
    } catch {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Please enable location access or search for a city.');
        }
      );
    }
  }, [fetchWeatherByCoords]);

  const transformAndSetWeatherData = (data: WeatherAPIResponse) => {
    // Transform API data to our WeatherData format
    const weatherData: WeatherData = {
      city: data.location.name,
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      pressure: data.current.pressure_mb,
      visibility: data.current.vis_km,
      feelsLike: data.current.feelslike_c,
      windDirection: data.current.wind_dir,
      uvIndex: data.current.uv,
      sunrise: data.forecast.forecastday[0].astro.sunrise,
      sunset: data.forecast.forecastday[0].astro.sunset,
    };

    const forecastData: ForecastDay[] = data.forecast.forecastday.map(day => ({
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      condition: day.day.condition.text,
      precipitation: day.day.daily_chance_of_rain,
      windSpeed: day.day.maxwind_kph,
    }));

    setWeather(weatherData);
    setForecast(forecastData);
  };

  const fetchWeatherByCity = () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');
    setTimeout(() => {
      const mockData = generateMockWeatherData(city);
      setWeather(mockData.current);
      setForecast(mockData.forecast);
      setLoading(false);
    }, 1000);
  };

  const generateMockWeatherData = (location: string) => ({
    current: {
      city: location,
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['Clear Sky', 'Light Rain', 'Heavy Rain', 'Partly Cloudy'][
        Math.floor(Math.random() * 4)
      ],
      humidity: Math.floor(Math.random() * 30) + 50,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      pressure: Math.floor(Math.random() * 50) + 980,
      visibility: Math.floor(Math.random() * 5) + 5,
      feelsLike: Math.floor(Math.random() * 30) + 10,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      uvIndex: Math.floor(Math.random() * 11),
      sunrise: '06:30',
      sunset: '18:30',
    },
    forecast: Array(5)
      .fill(null)
      .map((_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        maxTemp: Math.floor(Math.random() * 30) + 15,
        minTemp: Math.floor(Math.random() * 15) + 5,
        condition: ['Clear Sky', 'Light Rain', 'Heavy Rain', 'Partly Cloudy'][
          Math.floor(Math.random() * 4)
        ],
        precipitation: Math.floor(Math.random() * 100),
        windSpeed: Math.floor(Math.random() * 20) + 5,
      })),
  });

  const convertTemp = (temp: number): number => {
    return unit === 'fahrenheit' ? Math.round((temp * 9) / 5 + 32) : temp;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Clear Sky':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'Light Rain':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'Heavy Rain':
        return <CloudRain className="h-8 w-8 text-blue-600" />;
      case 'Partly Cloudy':
        return <CloudSun className="h-8 w-8 text-gray-400" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="max-w-4xl mx-auto p-4">
        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 p-2 rounded bg-white/10 text-white placeholder:text-white/70 border-0"
            />
            <button
              onClick={fetchWeatherByCity}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition-all"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : weather ? (
          <div className="space-y-4">
            {/* Main Weather Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Temperature */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center gap-3 text-white">
                  <Thermometer className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-70">Temperature</p>
                    <p className="text-xl font-bold">{weather.temperature}°C</p>
                    <p className="text-xs">Feels like {weather.feelsLike}°C</p>
                  </div>
                </div>
              </div>

              {/* Wind */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center gap-3 text-white">
                  <Wind className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-70">Wind</p>
                    <p className="text-xl font-bold">{weather.windSpeed} km/h</p>
                    <div className="flex items-center text-xs">
                      <Compass className="w-3 h-3 mr-1" />
                      <span>{weather.windDirection}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center gap-3 text-white">
                  <Droplets className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-70">Humidity</p>
                    <p className="text-xl font-bold">{weather.humidity}%</p>
                    <p className="text-xs">Pressure: {weather.pressure} hPa</p>
                  </div>
                </div>
              </div>

              {/* UV Index */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center gap-3 text-white">
                  <Sun className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-70">UV Index</p>
                    <p className="text-xl font-bold">{weather.uvIndex}</p>
                    <p className="text-xs">Visibility: {weather.visibility} km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Weather Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-white">
                {/* Sun Times */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-sm">Sunrise</p>
                      <p className="font-medium">{weather.sunrise}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-sm">Sunset</p>
                      <p className="font-medium">{weather.sunset}</p>
                    </div>
                  </div>
                </div>

                {/* Current Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-sm">Date</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-5 h-5" />
                    <div>
                      <p className="text-sm">Condition</p>
                      <p className="font-medium">{weather.condition}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <p className="text-sm">Location</p>
                      <p className="font-medium">{weather.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-5 h-5" />
                    <div>
                      <p className="text-sm">Precipitation</p>
                      <p className="font-medium">{weather.precipitation || '0'} mm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Section */}
            {forecast && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 overflow-x-auto">
                <h3 className="text-xl font-bold mb-4 text-white">5-Day Forecast</h3>
                <div className="grid grid-flow-col auto-cols-[minmax(130px,1fr)] gap-4">
                  {forecast.map((day) => (
                    <div key={day.date} className="text-center text-white p-3 bg-white/5 rounded-lg">
                      <p className="font-medium">{day.date}</p>
                      {getWeatherIcon(day.condition)}
                      <p className="mt-2">
                        {convertTemp(day.maxTemp)}°/{convertTemp(day.minTemp)}°
                      </p>
                      <div className="mt-2 text-xs space-y-1">
                        <p>💧 {day.precipitation}%</p>
                        <p>💨 {day.windSpeed} km/h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherApp;