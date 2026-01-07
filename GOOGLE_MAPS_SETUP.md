# Google Maps API Setup Instructions

To enable the Create Trip feature with Google Maps, you need to set up a Google Maps API key.

## Steps to Get Your API Key:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Either create a new project or select an existing one

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search for and enable:
     - **Maps JavaScript API**
     - **Places API** (for autocomplete functionality)

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Restrict Your API Key (Recommended)**
   - Click on your API key to edit it
   - Under "Application restrictions", choose "HTTP referrers"
   - Add your domain(s):
     - `localhost:*` (for local development)
     - Your production domain (e.g., `yourapp.com/*`)
   - Under "API restrictions", select "Restrict key"
   - Choose only: Maps JavaScript API and Places API

6. **Add API Key to Your Project**
   - Open `src/screens/trips/CreateTripScreen.tsx`
   - Find line 127: `script.src = https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key

## Features Implemented:

✅ **Google Maps focused on Sri Lanka**
- Map restricted to Sri Lanka bounds
- Centered on Sri Lanka coordinates
- Prevents panning outside Sri Lanka

✅ **Search with Autocomplete**
- Search box with instant suggestions
- 20 popular destinations pre-loaded
- Suggestions appear as you type (after 1 character)
- Shows up to 5 suggestions at a time

✅ **Interactive Map**
- Click anywhere on the map to place a marker
- Select from suggestions to place a marker
- Auto-zoom to selected location
- Clear search to reset view

✅ **Location Selection**
- Shows selected location name
- Continue button appears when location is selected
- Passes location data to next screen

## Popular Destinations Included:

- Colombo, Kandy, Galle
- Sigiriya, Ella, Nuwara Eliya
- Trincomalee, Anuradhapura, Polonnaruwa
- Jaffna, Mirissa, Bentota
- Negombo, Arugam Bay, Dambulla
- Yala National Park, Udawalawe National Park
- Adam's Peak, Hikkaduwa, Batticaloa

## Testing:

1. Run the development server: `npm run dev`
2. Navigate to Home and click "Create a Trip"
3. You should see a map focused on Sri Lanka
4. Try typing "Kandy" or "Colombo" to see suggestions
5. Click a suggestion or on the map to select a destination

## Billing Note:

Google Maps API is free up to a certain usage limit. For development and small applications, you likely won't exceed the free tier. Monitor your usage in the Google Cloud Console.
