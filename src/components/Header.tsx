"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  weatherCondition?: string;
}

const Header: React.FC<HeaderProps> = ({ weatherCondition }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Location share karne ka function
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Forecast page pe navigate karein with coordinates
          router.push(`/forecast?lat=${latitude}&lon=${longitude}`);
        },
        () => {
          alert('Location access denied. Please enable location services. 📍');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser 😔');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const getHeaderBackground = () => {
    if (!weatherCondition || !isScrolled) return 'bg-transparent';
    
    const condition = weatherCondition.toLowerCase();
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'bg-gray-800/30';
    } else if (condition.includes('sunny') || condition.includes('clear')) {
      return 'bg-orange-500/30';
    } else if (condition.includes('cloud')) {
      return 'bg-gray-600/30';
    } else if (condition.includes('snow')) {
      return 'bg-blue-300/30';
    } else if (condition.includes('fog') || condition.includes('mist')) {
      return 'bg-gray-400/30';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
      return 'bg-gray-900/30';
    } else {
      return 'bg-white/10';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300  backdrop-blur-md shadow-lg ${getHeaderBackground()}`}>
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white">WeatherNow</h1>
          </div>

          {/* Mobile Time Display */}
          <div className="flex md:hidden items-center justify-center">
            <p className="text-base font-bold text-white bg-white/10 px-3 py-1 rounded-full">
              {time.toLocaleTimeString('en-US', { 
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden bg-white/10 p-1.5 rounded-lg hover:bg-white/20 transition-all"
          >
            {!isMobileMenuOpen ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>

          {/* Desktop Time and Date */}
          <div className="hidden md:flex items-center space-x-6 text-white/90">
            <div className="text-center">
              <p className="text-sm font-medium">
                {time.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-2xl font-bold">
                {time.toLocaleTimeString('en-US', { 
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Navigation Links with Updated Share Location Button */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/forecast" 
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Forecast
            </Link>
            <button 
              onClick={handleShareLocation}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium backdrop-blur-sm flex items-center space-x-2"
            >
              <span>Share Location</span>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`absolute right-0 top-0 bottom-0 w-[280px] shadow-xl transition-all duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div>
            {/* Close Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 space-y-6">
            
              
              <nav className="space-y-3">
                <Link href="/" className="flex items-center space-x-3 bg-red-500 text-white hover:bg-gray-400 p-4 rounded-xl transition-all">
                  <span className="text-xl">🏠</span>
                  <span className="font-medium text-lg ">Dashboard</span>
                </Link>
                <Link href="/forecast" className="flex items-center space-x-3 bg-red-500 text-white hover:bg-gray-400 p-4 rounded-xl transition-all">
                  <span className="text-xl">📅</span>
                  <span className="font-medium text-lg ">Forecast</span>
                </Link>
                <button 
                  onClick={handleShareLocation}
                  className="w-full flex items-center space-x-3 bg-red-500 text-white hover:bg-gray-400 p-4 rounded-xl transition-all"
                >
                  <span className="text-xl">📍</span>
                  <span className="font-medium text-lg">Share Location</span>
                </button>
              </nav>

              <div className="absolute  left-6 right-6 space-y-2">
                <div className="bg-white p-4 rounded-xl shadow-sm ">
                  <p className="text-gray-600 text-sm font-medium">Current Time</p>
                  <p className="text-gray-800 text-2xl font-bold">
                    {time.toLocaleTimeString('en-US', { 
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
