'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Forecast from '@/components/Forecast';
import Header from '../../components/Header';

function ForecastContent() {
  const searchParams = useSearchParams();
  const latitude = parseFloat(searchParams.get('lat') || '0');
  const longitude = parseFloat(searchParams.get('lon') || '0');

  return (
    <div className="min-h-screen">
      <Header />
      <Forecast latitude={latitude} longitude={longitude} />
    </div>
  );
}

export default function ForecastPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Loading... ⌛</h2>
          <p>Getting your forecast ready!</p>
        </div>
      </div>
    }>
      <ForecastContent />
    </Suspense>
  );
} 