import React from 'react';
import type { WeatherAPIResponse } from '@/types/weather';

interface ForecastProps {
  latitude?: number;
  longitude?: number;
}

const Forecast: React.FC<ForecastProps> = ({ latitude, longitude }) => {
  const [forecast, setForecast] = React.useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const getWeatherEmoji = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('sunny')) return '☀️';
    if (c.includes('clear')) return '🌞';
    if (c.includes('rain')) return '🌧️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('storm') || c.includes('thunder')) return '⛈️';
    if (c.includes('snow')) return '❄️';
    if (c.includes('fog') || c.includes('mist')) return '🌫️';
    if (c.includes('wind')) return '💨';
    return '🌡️';
  };

  React.useEffect(() => {
    const fetchForecast = async () => {
      if (!latitude || !longitude) return;
      
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=yes`
        );
        const data: WeatherAPIResponse = await response.json();
        setForecast(data);
        setError('');
      } catch {
        setError('Failed to fetch forecast data 😔');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Please share your location first! 📍</h2>
          <p>Click on the share location button to see the forecast ⛅</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Loading your forecast... ⌛</h2>
          <p>Getting the latest weather data for you! 🌤️</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong 😔</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getWeatherPrediction = (forecastData: WeatherAPIResponse) => {
    const today = forecastData.forecast.forecastday[0].day;
    const tomorrow = forecastData.forecast.forecastday[1].day;
    
    let prediction = '🤔 Weather Prediction:\n';
    
    // Temperature change
    if (tomorrow.avgtemp_c > today.avgtemp_c + 2) {
      prediction += '🌡️ Temperature will rise tomorrow! ';
    } else if (tomorrow.avgtemp_c < today.avgtemp_c - 2) {
      prediction += '❄️ Expect cooler weather tomorrow! ';
    }
    
    // Rain prediction
    if (tomorrow.daily_chance_of_rain > 70) {
      prediction += '🌧️ High chance of rain tomorrow! ';
    } else if (tomorrow.daily_chance_of_rain > 30) {
      prediction += '☔ Keep an umbrella handy! ';
    }
    
    // Wind prediction
    if (tomorrow.maxwind_kph > 30) {
      prediction += '💨 Expect windy conditions! ';
    }
    
    return prediction;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-16 sm:py-20 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {forecast && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-6 text-white">
              <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">
                Weather Prediction 🔮
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {getWeatherPrediction(forecast)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-2xl font-bold">
                  7-Day Forecast 📅
                </h2>
                <p className="text-xs sm:text-sm opacity-75">
                  {forecast.location.name}
                </p>
              </div>
              
              <div className="overflow-x-auto pb-2">
                <div className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] md:auto-cols-[minmax(120px,1fr)] gap-3 sm:gap-4 min-w-[min-content]">
                  {forecast.forecast.forecastday.map((day: WeatherAPIResponse['forecast']['forecastday'][0]) => (
                    <div 
                      key={day.date}
                      className="bg-white/10 rounded-lg p-3 sm:p-4 hover:bg-white/20 transition-all"
                    >
                      <div className="text-center">
                        <p className="font-medium text-sm sm:text-base mb-1 sm:mb-2">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">
                          {getWeatherEmoji(day.day.condition.text)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xl sm:text-2xl font-bold">
                            {Math.round(day.day.avgtemp_c)}°C
                          </p>
                          <p className="text-xs sm:text-sm opacity-75">
                            {day.day.condition.text}
                          </p>
                          <div className="text-[10px] sm:text-xs space-y-0.5 mt-2">
                            <p>💧 {day.day.daily_chance_of_rain}% rain</p>
                            <p>💨 {Math.round(day.day.maxwind_kph)} km/h</p>
                            <p>☀️ UV: {Math.round(day.day.uv)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Today&apos;s Highlights ��</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm opacity-75">Sunrise & Sunset</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm sm:text-base">🌅 {forecast.forecast.forecastday[0].astro.sunrise}</p>
                    <p className="text-sm sm:text-base">🌇 {forecast.forecast.forecastday[0].astro.sunset}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm opacity-75">Moon Phase</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm sm:text-base">🌙 {forecast.forecast.forecastday[0].astro.moon_phase}</p>
                    <p className="text-sm sm:text-base">🌑 {forecast.forecast.forecastday[0].astro.moon_illumination}% illumination</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm opacity-75">Air Quality</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm sm:text-base">💨 {forecast.current.air_quality?.['us-epa-index'] || 'N/A'} US EPA Index</p>
                    <p className="text-sm sm:text-base">🌬️ {Math.round(forecast.current.wind_kph)} km/h winds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast; 