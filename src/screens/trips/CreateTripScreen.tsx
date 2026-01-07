import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, X, Navigation } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Geolocation } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Destination } from '@/models';
import { mockDestinations } from '@/services/mock.data';

// Declare Leaflet types
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

// Convert mockDestinations to location format for search
const SRI_LANKA_DESTINATIONS = mockDestinations.map(dest => ({
  name: dest.name,
  lat: dest.coordinates.latitude,
  lng: dest.coordinates.longitude
}));

// Additional popular destinations not in mockDestinations
const ADDITIONAL_DESTINATIONS = [
  { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
  { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
  { name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891 },
  { name: 'Trincomalee', lat: 8.5874, lng: 81.2152 },
  { name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
  { name: 'Bentota', lat: 6.4264, lng: 79.9951 },
  { name: 'Arugam Bay', lat: 6.8408, lng: 81.8364 },
  { name: 'Negombo', lat: 7.2084, lng: 79.8358 },
  { name: 'Hikkaduwa', lat: 6.1409, lng: 80.1028 },
  { name: 'Yala National Park', lat: 6.3714, lng: 81.5169 },
  { name: 'Unawatuna', lat: 6.0094, lng: 80.2503 },
  { name: 'Matara', lat: 5.9549, lng: 80.5550 },
  { name: 'Tangalle', lat: 6.0234, lng: 80.7961 },
  { name: 'Gampola', lat: 7.1644, lng: 80.5770 },
  { name: 'Gal Oya National Park', lat: 7.2364, lng: 81.3469 },
  { name: 'Knuckles Mountain Range', lat: 7.4500, lng: 80.7833 },
  { name: 'Pigeon Island', lat: 8.7167, lng: 81.2167 },
  { name: 'Ratnapura', lat: 6.6828, lng: 80.4003 },
  { name: 'Bundala National Park', lat: 6.1914, lng: 81.2039 },
  { name: 'Sinharaja Rainforest', lat: 6.4014, lng: 80.4008 },
  { name: 'Wilpattu National Park', lat: 8.4833, lng: 80.0333 },
  { name: 'Udawalawe National Park', lat: 6.4833, lng: 80.8833 },
  { name: 'Minneriya', lat: 8.0333, lng: 80.9000 },
  { name: 'Pasikudah', lat: 7.9333, lng: 81.5667 },
  { name: 'Kalkudah', lat: 7.9167, lng: 81.5500 },
  { name: 'Weligama', lat: 5.9667, lng: 80.4333 },
  { name: 'Hiriketiya', lat: 5.9833, lng: 80.7000 },
  { name: 'Ahangama', lat: 5.9667, lng: 80.3667 },
  { name: 'Kalpitiya', lat: 8.2333, lng: 79.7667 },
  { name: 'Kitulgala', lat: 6.9889, lng: 80.4186 },
  { name: 'Hatton', lat: 6.8917, lng: 80.5972 },
  { name: 'Haputale', lat: 6.7667, lng: 80.9667 },
  { name: 'Horton Plains', lat: 6.8167, lng: 80.8000 },
  { name: "Adam's Peak", lat: 6.8094, lng: 80.4994 },
  { name: 'Dambulla Cave Temple', lat: 7.8606, lng: 80.6518 },
  { name: 'Temple of the Tooth', lat: 7.2935, lng: 80.6405 },
  { name: 'Mihintale', lat: 8.3511, lng: 80.5039 },
  { name: 'Yapahuwa', lat: 7.8333, lng: 80.3667 },
];

// Combine both lists
const ALL_DESTINATIONS = [...SRI_LANKA_DESTINATIONS, ...ADDITIONAL_DESTINATIONS];

// Sri Lanka bounds
const SRI_LANKA_BOUNDS = {
  north: 9.8,
  south: 5.9,
  west: 79.5,
  east: 81.9,
};

// Center of Sri Lanka
const SRI_LANKA_CENTER = {
  lat: 7.8731,
  lng: 80.7718,
};

export const CreateTripScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedDestination = location.state?.destination as Destination | undefined;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof ALL_DESTINATIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [transportMethod, setTransportMethod] = useState<'ubergo' | 'uberx' | 'uberpremier' | 'ubermoto' | null>(null);
  const [routeDistance, setRouteDistance] = useState<number>(0);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentLocationMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routingControlRef = useRef<any>(null);

  const addMarker = useCallback((lat: number, lng: number, title?: string) => {
    if (!leafletMapRef.current || !window.L) return;

    // Remove existing marker
    if (markerRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
    }

    // Add new marker with custom icon
    const marker = window.L.marker([lat, lng], {
      title: title || 'Selected Location'
    }).addTo(leafletMapRef.current);

    // Add popup
    if (title) {
      marker.bindPopup(title).openPopup();
    }

    markerRef.current = marker;

    // Center map on marker
    leafletMapRef.current.setView([lat, lng], leafletMapRef.current.getZoom());
  }, []);

  // Initialize OpenStreetMap with Leaflet
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !window.L) return;

    try {
      // Create map centered on Sri Lanka
      const map = window.L.map(mapRef.current, {
        center: [SRI_LANKA_CENTER.lat, SRI_LANKA_CENTER.lng],
        zoom: 8,
        maxBounds: [
          [SRI_LANKA_BOUNDS.south, SRI_LANKA_BOUNDS.west],
          [SRI_LANKA_BOUNDS.north, SRI_LANKA_BOUNDS.east]
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 7,
        maxZoom: 18
      });

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      leafletMapRef.current = map;
      setMapLoaded(true);

      // Add click listener to map
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on('click', (e: any) => {
        if (e.latlng) {
          addMarker(e.latlng.lat, e.latlng.lng);
        }
      });

      // Get user's current location using Capacitor
      try {
        // First check permissions
        const permissions = await Geolocation.checkPermissions();
        
        if (permissions.location !== 'granted') {
          // Request permissions if not granted
          const permissionResult = await Geolocation.requestPermissions();
          if (permissionResult.location !== 'granted') {
            console.log('Location permission denied');
            return;
          }
        }
        
        // Now get the position
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
        
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // Add current location marker (blue marker)
        if (currentLocationMarkerRef.current) {
          map.removeLayer(currentLocationMarkerRef.current);
        }
        
        const currentMarker = window.L.circleMarker([latitude, longitude], {
          radius: 8,
          fillColor: '#3b82f6',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);
        
        currentMarker.bindPopup('Your Location');
        currentLocationMarkerRef.current = currentMarker;
      } catch (error) {
        console.log('Location access error:', error);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  }, [addMarker]);

  useEffect(() => {
    const loadLeaflet = () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Small delay to ensure CSS is loaded
        setTimeout(() => initializeMap(), 100);
      };
      script.onerror = () => {
        setMapError(true);
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    // Cleanup on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, [initializeMap]);

  // Handle pre-selected destination from navigation state
  useEffect(() => {
    if (preSelectedDestination && mapLoaded && leafletMapRef.current) {
      const destLocation = {
        name: preSelectedDestination.name,
        lat: preSelectedDestination.coordinates.latitude,
        lng: preSelectedDestination.coordinates.longitude
      };
      
      // Set the search query and selected location
      setSearchQuery(preSelectedDestination.name);
      setSelectedLocation(destLocation);
      
      // Add marker to map
      addMarker(destLocation.lat, destLocation.lng, destLocation.name);
      
      // Zoom in on selected location
      leafletMapRef.current.setView([destLocation.lat, destLocation.lng], 12);
    }
  }, [preSelectedDestination, mapLoaded, addMarker]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter destinations based on search query - show all matches
    const filtered = ALL_DESTINATIONS.filter(destination =>
      destination.name.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== '' && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSelectSuggestion = (destination: typeof SRI_LANKA_DESTINATIONS[0]) => {
    setSearchQuery(destination.name);
    setSelectedLocation(destination);
    setShowSuggestions(false);
    
    // Add marker to map
    addMarker(destination.lat, destination.lng, destination.name);
    
    // Zoom in on selected location
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([destination.lat, destination.lng], 12);
    }
  };

  const calculatePickMeCost = useCallback((distanceKm: number, method: 'ubergo' | 'uberx' | 'uberpremier' | 'ubermoto'): number => {
    // Uber Sri Lanka pricing (actual rates as of 2026)
    const pricing = {
      ubergo: {
        base: 100,      // Base fare for UberGo (economy)
        perKm: 65,      // Per km rate
        minimum: 150    // Minimum fare
      },
      uberx: {
        base: 120,      // Base fare for UberX (comfort)
        perKm: 75,      // Per km rate
        minimum: 200    // Minimum fare
      },
      uberpremier: {
        base: 180,      // Base fare for UberPremier (premium)
        perKm: 100,     // Per km rate
        minimum: 300    // Minimum fare
      },
      ubermoto: {
        base: 60,       // Base fare for UberMoto (bike)
        perKm: 50,      // Per km rate
        minimum: 100    // Minimum fare
      }
    };

    const rate = pricing[method];
    const calculatedCost = rate.base + (distanceKm * rate.perKm);
    return Math.max(calculatedCost, rate.minimum);
  }, []);

  const showRouteOnMap = useCallback(async (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    if (!leafletMapRef.current || !window.L) return;

    // Remove existing route if any
    if (routingControlRef.current) {
      leafletMapRef.current.removeControl(routingControlRef.current);
    }

    // Load routing machine if not already loaded
    if (!window.L.Routing) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js';
      script.async = true;
      
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css';
      
      document.head.appendChild(cssLink);
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // Create routing control
    const routingControl = window.L.Routing.control({
      waypoints: [
        window.L.latLng(from.lat, from.lng),
        window.L.latLng(to.lat, to.lng)
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      router: window.L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving', // Use driving profile for shortest/fastest route
      }),
      lineOptions: {
        styles: [{ color: '#f59e0b', opacity: 0.8, weight: 6 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      createMarker: () => null, // Don't create default markers, we have our own
      show: false, // Hide the instruction panel
      collapsible: false,
    }).addTo(leafletMapRef.current);
    
    // Listen for route found event to get distance
    routingControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const distanceMeters = routes[0].summary.totalDistance;
        const distanceKm = distanceMeters / 1000;
        setRouteDistance(distanceKm);
        
        // Calculate cost for default transport method (UberGo)
        if (!transportMethod) {
          setTransportMethod('ubergo');
          setEstimatedCost(calculatePickMeCost(distanceKm, 'ubergo'));
        } else {
          setEstimatedCost(calculatePickMeCost(distanceKm, transportMethod));
        }
      }
    });
    
    // Hide the routing instructions container
    const container = routingControl.getContainer();
    if (container) {
      container.style.display = 'none';
    }

    routingControlRef.current = routingControl;
    setShowRoute(true);
  }, [calculatePickMeCost, transportMethod]);

  const handleTransportMethodChange = (method: 'ubergo' | 'uberx' | 'uberpremier' | 'ubermoto') => {
    setTransportMethod(method);
    if (routeDistance > 0) {
      setEstimatedCost(calculatePickMeCost(routeDistance, method));
    }
  };

  const handleBookPickMe = () => {
    setShowBookingDialog(true);
  };

  const handleOpenPickMe = async () => {
    if (!currentLocation || !selectedLocation) return;

    const pickupLat = currentLocation.lat;
    const pickupLng = currentLocation.lng;
    const dropLat = selectedLocation.lat;
    const dropLng = selectedLocation.lng;

    // Uber deep link format
    const uberDeepLink = `uber://?action=setPickup&pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&dropoff[latitude]=${dropLat}&dropoff[longitude]=${dropLng}&dropoff[nickname]=${encodeURIComponent(selectedLocation.name)}&product_id=`;
    
    // Uber web fallback
    const uberWebUrl = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&dropoff[latitude]=${dropLat}&dropoff[longitude]=${dropLng}&dropoff[nickname]=${encodeURIComponent(selectedLocation.name)}`;
    
    try {
      // Try to open Uber app
      window.location.href = uberDeepLink;
      
      // If app doesn't open in 2 seconds, show fallback options
      setTimeout(() => {
        if (!document.hidden) {
          const userChoice = confirm('If Uber app didn\'t open, would you like to:\n\n✓ Open Uber in browser\n✗ Cancel\n\nPress OK to continue in browser');
          
          if (userChoice) {
            window.open(uberWebUrl, '_system');
          }
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error opening Uber:', error);
      // Fallback to web version
      window.open(uberWebUrl, '_system');
    }
    
    setShowBookingDialog(false);
  };

  const handleCopyDetails = async () => {
    if (!currentLocation || !selectedLocation) return;

    const vehicleName = transportMethod === 'ubergo' ? 'UberGo' : transportMethod === 'uberx' ? 'UberX' : transportMethod === 'uberpremier' ? 'UberPremier' : 'UberMoto';
    const bookingDetails = `Uber Booking Details:\n\nPickup: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}\nDrop-off: ${selectedLocation.name}\nCoordinates: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}\nDistance: ${routeDistance.toFixed(1)} km\nVehicle: ${vehicleName}\nEstimated Cost: LKR ${estimatedCost.toFixed(0)}`;

    try {
      await Share.share({
        title: 'Uber Booking',
        text: bookingDetails,
        dialogTitle: 'Share Booking Details'
      });
    } catch (error) {
      // Fallback to alert
      alert(bookingDetails);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedLocation(null);
    
    if (markerRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([SRI_LANKA_CENTER.lat, SRI_LANKA_CENTER.lng], 8);
    }
  };

  const handleContinue = async () => {
    if (!selectedLocation) return;
    
    // Check if location is enabled
    if (!currentLocation) {
      // Show alert asking user to turn on location
      if (confirm('Please turn on your device location to see the best route. This helps us show directions from your current location to your destination.\n\nDo you want to enable location?')) {
        try {
          // Check current permissions status
          const currentPermissions = await Geolocation.checkPermissions();
          
          let hasPermission = currentPermissions.location === 'granted';
          
          // Request location permissions if not granted
          if (!hasPermission) {
            const permissions = await Geolocation.requestPermissions();
            hasPermission = permissions.location === 'granted';
          }
          
          if (hasPermission) {
            // Get current position with better options
            const position = await Geolocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0
            });
            
            const { latitude, longitude } = position.coords;
            const newCurrentLocation = { lat: latitude, lng: longitude };
            setCurrentLocation(newCurrentLocation);
            
            // Add current location marker if not exists
            if (leafletMapRef.current && !currentLocationMarkerRef.current) {
              const currentMarker = window.L.circleMarker([latitude, longitude], {
                radius: 8,
                fillColor: '#3b82f6',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              }).addTo(leafletMapRef.current);
              
              currentMarker.bindPopup('Your Location').openPopup();
              currentLocationMarkerRef.current = currentMarker;
            }
            
            // Show route from current location to destination
            await showRouteOnMap(newCurrentLocation, selectedLocation);
          } else {
            alert('Location permission was denied. Please enable location access in your device settings:\n\nSettings > Apps > WanderMate > Permissions > Location');
          }
        } catch (error: any) {
          console.error('Error getting location:', error);
          let errorMessage = 'Unable to access location. ';
          
          if (error.message?.includes('timeout')) {
            errorMessage += 'Location request timed out. Please ensure GPS is enabled and try again.';
          } else if (error.message?.includes('denied')) {
            errorMessage += 'Please enable location access in:\nSettings > Apps > WanderMate > Permissions > Location';
          } else {
            errorMessage += 'Please ensure:\n1. Location/GPS is turned on\n2. App has location permission\n3. You are outdoors or near a window';
          }
          
          alert(errorMessage);
        }
      }
    } else {
      // Location already available, show route
      await showRouteOnMap(currentLocation, selectedLocation);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-sunset px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Create a Trip</h1>
            <p className="text-sm text-white/80">Choose your destination in Sri Lanka</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search for a destination..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="pl-10 pr-10 bg-white/95 border-none"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <Card variant="elevated" className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-[9999] shadow-lg">
              {suggestions.map((destination, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(destination)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                >
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{destination.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                    </p>
                  </div>
                </button>
              ))}
            </Card>
          )}
        </div>
        
        {selectedLocation && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-white" />
            <span className="font-medium text-white">{selectedLocation.name}</span>
          </div>
        )}
      </div>

      {/* Transport Method Selector & Cost Display */}
      {showRoute && routeDistance > 0 && (
        <div className="px-4 py-3 bg-background border-b border-border">
          <p className="text-xs text-muted-foreground mb-2">Choose Uber ride type</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => handleTransportMethodChange('ubergo')}
              className={`px-3 py-2 rounded-lg border transition-all ${
                transportMethod === 'ubergo'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary'
              }`}
            >
              <div className="text-xs font-medium">🚙 UberGo</div>
              <div className="text-[10px] text-muted-foreground">Economy</div>
            </button>
            <button
              onClick={() => handleTransportMethodChange('uberx')}
              className={`px-3 py-2 rounded-lg border transition-all ${
                transportMethod === 'uberx'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary'
              }`}
            >
              <div className="text-xs font-medium">🚗 UberX</div>
              <div className="text-[10px] text-muted-foreground">Comfort</div>
            </button>
            <button
              onClick={() => handleTransportMethodChange('uberpremier')}
              className={`px-3 py-2 rounded-lg border transition-all ${
                transportMethod === 'uberpremier'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary'
              }`}
            >
              <div className="text-xs font-medium">🚙 Premier</div>
              <div className="text-[10px] text-muted-foreground">Premium</div>
            </button>
            <button
              onClick={() => handleTransportMethodChange('ubermoto')}
              className={`px-3 py-2 rounded-lg border transition-all ${
                transportMethod === 'ubermoto'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary'
              }`}
            >
              <div className="text-xs font-medium">🏍️ Moto</div>
              <div className="text-[10px] text-muted-foreground">Bike</div>
            </button>
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-sunset/10 rounded-lg px-4 py-2">
            <div>
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="text-sm font-semibold text-foreground">{routeDistance.toFixed(1)} km</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Estimated Cost</p>
              <p className="text-lg font-bold text-primary">LKR {estimatedCost.toFixed(0)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
        
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 p-6">
            <Card variant="elevated" className="p-6 max-w-md">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Map Not Available
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Unable to load the map. Please check your internet connection and try again.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="w-full"
                >
                  Go Back
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {selectedLocation && (
        <div className="p-4 bg-background border-t border-border space-y-2">
          {!showRoute ? (
            <Button 
              variant="sunset" 
              size="lg" 
              className="w-full"
              onClick={handleContinue}
            >
              <Navigation className="h-5 w-5 mr-2" />
              Show Route to {selectedLocation.name}
            </Button>
          ) : (
            <>
              <div className="bg-muted/50 rounded-lg px-4 py-2 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Total Distance</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{routeDistance.toFixed(1)} km</span>
                </div>
              </div>
              <Button 
                variant="sunset" 
                size="lg" 
                className="w-full"
                onClick={handleBookPickMe}
                disabled={!transportMethod}
              >
                <span className="text-lg mr-2">🚕</span>
                Book Uber {transportMethod === 'ubergo' ? 'Go' : transportMethod === 'uberx' ? 'X' : transportMethod === 'uberpremier' ? 'Premier' : 'Moto'} - LKR {estimatedCost.toFixed(0)}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Opens Uber app for real-time booking and payment
              </p>
            </>
          )}
        </div>
      )}
      {/* Booking Dialog */}
      {showBookingDialog && currentLocation && selectedLocation && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-[10000]">
          <Card variant="elevated" className="max-w-md w-full p-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Book with Uber
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">From (Your Location)</p>
                <p className="text-sm font-mono text-foreground">
                  {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">To</p>
                <p className="text-sm font-semibold text-foreground">{selectedLocation.name}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-primary/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="text-sm font-semibold text-primary">{routeDistance.toFixed(1)} km</p>
                </div>
                <div className="flex-1 bg-primary/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                  <p className="text-sm font-semibold text-primary">
                    {transportMethod === 'ubergo' ? 'UberGo' : transportMethod === 'uberx' ? 'UberX' : transportMethod === 'uberpremier' ? 'Premier' : 'UberMoto'}
                  </p>
                </div>
                <div className="flex-1 bg-sunset/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="text-sm font-bold text-sunset">LKR {estimatedCost.toFixed(0)}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 text-center">
              Tap to copy details and open PickMe or Uber app
            </p>
            
            <div className="space-y-2">
              <Button 
                variant="sunset" 
                size="lg" 
                className="w-full"
                onClick={handleOpenPickMe}
              >
                <span className="text-lg mr-2">🚕</span> Open Uber App
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={handleCopyDetails}
              >
                📋 Share Booking Details
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full"
                onClick={() => setShowBookingDialog(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
