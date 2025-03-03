"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Image from 'next/image';

interface WeatherResponse {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    feelslike_c: number;
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
  };
}

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`
      );
      setWeather(response.data);
      setError('');
    } catch {
      setWeather(null);
      setError('Failed to fetch weather data');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) fetchWeather(city);
  };

  const getWeatherBackground = () => {
    if (!weather) return 'from-blue-500 via-purple-500 to-pink-500';
    
    const condition = weather.current.condition.text.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'from-gray-700 via-gray-800 to-gray-900 animate-rain';
    } else if (condition.includes('sunny') || condition.includes('clear')) {
      return 'from-yellow-400 via-orange-500 to-red-500';
    } else if (condition.includes('cloud')) {
      return 'from-gray-400 via-gray-600 to-blue-500';
    } else if (condition.includes('snow')) {
      return 'from-blue-100 via-blue-300 to-blue-500';
    } else if (condition.includes('fog') || condition.includes('mist')) {
      return 'from-gray-300 via-gray-400 to-gray-500';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
      return 'from-gray-900 via-purple-900 to-gray-900 animate-thunder';
    } else {
      return 'from-blue-500 via-purple-500 to-pink-500';
    }
  };

  const getWeatherPrediction = (weatherData: WeatherResponse | null) => {
    if (!weatherData) return '';
    
    let prediction = '';
    const condition = weatherData.current.condition.text.toLowerCase();
    const temp = weatherData.current.temp_c;
    const humidity = weatherData.current.humidity;
    const windKph = weatherData.current.wind_kph;
    
    // Temperature based prediction
    if (temp > 30) {
      prediction += '🌡️ Garmi bohot hai! AC chalana na bhoolein. ';
    } else if (temp < 15) {
      prediction += '❄️ Thandi hai, garam kapde pehen lein. ';
    }
    
    // Condition based prediction
    if (condition.includes('rain')) {
      prediction += '☔ Barish ho rahi hai, chata saath rakhein! ';
    } else if (condition.includes('cloud')) {
      prediction += '☁️ Badal chaye hain, barish ho sakti hai. ';
    }
    
    // Humidity based prediction
    if (humidity > 80) {
      prediction += '💧 Humidity zyada hai, uncomfortable feel ho sakta hai. ';
    }
    
    // Wind based prediction
    if (windKph > 20) {
      prediction += '💨 Tez hawa chal rahi hai! ';
    }
    
    return prediction || '🌈 Mausam suhana hai!';
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rain {
        0% { background-position: 0% 0%; }
        100% { background-position: 20% 100%; }
      }
      
      @keyframes thunder {
        0% { opacity: 1; }
        20% { opacity: 0.8; }
        22% { opacity: 1; }
        24% { opacity: 0.8; }
        26% { opacity: 1; }
        100% { opacity: 1; }
      }
      
      .animate-rain {
        background-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%),
          url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 0h1v6H4zm7 6h1v6h-1z' fill='%23FFFFFF' fill-opacity='0.3'/%3E%3C/svg%3E");
        animation: rain 3s linear infinite;
      }
      
      .animate-thunder {
        animation: thunder 5s ease infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleGeolocation = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    fetchWeather(`${latitude},${longitude}`);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      handleGeolocation,
      () => {
        setError('Please enable location access or search for a city.');
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="A simple weather app built with Next.js, Tailwind, and TypeScript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header weatherCondition={weather?.current.condition.text} />
      <main className={`min-h-screen flex flex-col bg-gradient-to-br ${getWeatherBackground()}`}>
        <div className="flex-1 px-2 sm:px-4 md:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Weather Today
              </h1>

              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 sm:p-3 md:p-4 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-1.5 rounded-lg hover:bg-blue-600 active:scale-95 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 rounded text-xs">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {weather && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center space-y-0.5">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      {weather.location.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {weather.location.country}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 sm:gap-4 bg-gradient-to-r from-blue-50 to-purple-50 p-2 sm:p-4 rounded-lg">
                    <Image 
                      src={weather.current.condition.icon}
                      alt={weather.current.condition.text}
                      width={48}
                      height={48}
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                    />
                    <div className="text-center">
                      <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                        {Math.round(weather.current.temp_c)}°
                      </span>
                      <p className="text-xs sm:text-base text-gray-600 capitalize">
                        {weather.current.condition.text}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg">🌡️</span>
                        <span className="text-gray-600">Feels Like</span>
                      </div>
                      <p className="font-semibold text-gray-800">{Math.round(weather.current.feelslike_c)}°C</p>
                    </div>

                    <div className="bg-purple-50 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg">💧</span>
                        <span className="text-gray-600">Humidity</span>
                      </div>
                      <p className="font-semibold text-gray-800">{weather.current.humidity}%</p>
                    </div>

                    <div className="bg-pink-50 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg">💨</span>
                        <span className="text-gray-600">Wind</span>
                      </div>
                      <p className="font-semibold text-gray-800">{weather.current.wind_kph} km/h</p>
                    </div>

                    <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg">🌊</span>
                        <span className="text-gray-600">Pressure</span>
                      </div>
                      <p className="font-semibold text-gray-800">{weather.current.pressure_mb} mb</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                      <span>🔮</span>
                      <span>Mausam ki Prediction</span>
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">{getWeatherPrediction(weather)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default WeatherApp;
