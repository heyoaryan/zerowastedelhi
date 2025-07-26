// Simple location system - user selects their area
export const getLocationWithUserChoice = async (lat, lon) => {
  console.log(`📍 Getting location options for: ${lat}, ${lon}`);
  
  // Delhi areas organized by district
  const delhiAreas = {
    'North Delhi': [
      'Civil Lines', 'Model Town', 'Kamla Nagar', 'Sant Nagar', 'Swaroop Nagar',
      'Timarpur', 'Shastri Nagar', 'Azadpur', 'Burari', 'Kashmere Gate'
    ],
    'Central Delhi': [
      'Connaught Place', 'Karol Bagh', 'Paharganj', 'Chandni Chowk', 
      'Jama Masjid', 'Red Fort', 'Daryaganj', 'Rajiv Chowk'
    ],
    'South Delhi': [
      'Lajpat Nagar', 'Defence Colony', 'Saket', 'Greater Kailash', 
      'Nehru Place', 'Green Park', 'Hauz Khas', 'Malviya Nagar', 
      'Kalkaji', 'Govindpuri', 'Lodhi Road'
    ],
    'East Delhi': [
      'Laxmi Nagar', 'Preet Vihar', 'Mayur Vihar', 'Shahdara', 
      'Anand Vihar', 'Patparganj', 'Geeta Colony', 'Krishna Nagar'
    ],
    'West Delhi': [
      'Rajouri Garden', 'Janakpuri', 'Tilak Nagar', 'Punjabi Bagh', 
      'Paschim Vihar', 'Subhash Nagar', 'Kirti Nagar', 'Moti Nagar'
    ],
    'South West Delhi': [
      'Dwarka', 'Vasant Kunj', 'Munirka', 'RK Puram', 'Vasant Vihar'
    ],
    'North West Delhi': [
      'Rohini', 'Pitampura', 'Shalimar Bagh', 'Kohat Enclave', 'Ashok Vihar'
    ]
  };

  return {
    coordinates: { latitude: lat, longitude: lon },
    availableAreas: delhiAreas,
    message: 'Please select your area from the list',
    requiresUserSelection: true
  };
};

export default getLocationWithUserChoice;