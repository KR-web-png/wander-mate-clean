import { Coordinates, LocationData } from '@/models';

export interface GeolocationResult {
  success: boolean;
  location?: LocationData;
  error?: string;
}

export const locationService = {
  // Get current location
  async getCurrentLocation(): Promise<GeolocationResult> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          success: false,
          error: 'Geolocation is not supported by your browser'
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Reverse geocode to get address (mock)
          const locationData: LocationData = {
            coordinates,
            address: 'Current Location',
            city: 'Unknown',
            country: 'Unknown',
            timestamp: new Date(),
            accuracy: position.coords.accuracy
          };

          resolve({
            success: true,
            location: locationData
          });
        },
        (error) => {
          let errorMessage = 'Unable to get location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }

          resolve({
            success: false,
            error: errorMessage
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  },

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * 
      Math.cos(this.toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  },

  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  // Check if user is within a geofence
  isWithinGeofence(
    userLocation: Coordinates, 
    targetLocation: Coordinates, 
    radiusKm: number = 0.5
  ): boolean {
    const distance = this.calculateDistance(userLocation, targetLocation);
    return distance <= radiusKm;
  },

  // Verify destination arrival
  async verifyDestinationArrival(
    destinationCoordinates: Coordinates,
    radiusKm: number = 0.5
  ): Promise<{ arrived: boolean; distance?: number; error?: string }> {
    const result = await this.getCurrentLocation();
    
    if (!result.success || !result.location) {
      return {
        arrived: false,
        error: result.error || 'Could not get location'
      };
    }

    const distance = this.calculateDistance(
      result.location.coordinates,
      destinationCoordinates
    );

    return {
      arrived: distance <= radiusKm,
      distance
    };
  },

  // Watch position changes
  watchPosition(
    onUpdate: (location: LocationData) => void,
    onError: (error: string) => void
  ): number | null {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported');
      return null;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          address: 'Current Location',
          city: 'Unknown',
          country: 'Unknown',
          timestamp: new Date(),
          accuracy: position.coords.accuracy
        };
        onUpdate(locationData);
      },
      (error) => {
        onError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  },

  // Stop watching position
  clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  },

  // Format distance for display
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }
};
