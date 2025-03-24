export interface Place {
  id: number;
  name: string;
  address: string;
  coordinates: [number, number]; // [latitude, longitude]
  notes?: string;
}

// Placeholder coordinates - these will need to be replaced with actual coordinates
export const cheesecakePlaces: Place[] = [
  {
    id: 1,
    name: "Swirled by Ritu",
    address: "Tower 10, Ground Floor, RMZ Nexity, Hitech City, Hyderabad",
    coordinates: [17.4438, 78.3818], // Hitech City approximate coordinates
  },
  {
    id: 2,
    name: "Le Sucre",
    address: "Kokapet, Hyderabad",
    coordinates: [17.4047, 78.3456], // Kokapet approximate coordinates
  },
  {
    id: 3,
    name: "Taro",
    address: "Jubilee Hills, Hyderabad",
    coordinates: [17.4239, 78.4079], // Jubilee Hills approximate coordinates
  },
  {
    id: 4,
    name: "Prezmo",
    address: "Kokapet, Hyderabad",
    coordinates: [17.4047, 78.3456], // Kokapet approximate coordinates
  },
  {
    id: 5,
    name: "Cove",
    address: "Jubilee Hills, Hyderabad",
    coordinates: [17.4239, 78.4079], // Jubilee Hills approximate coordinates
  },
  {
    id: 6,
    name: "Fienfi",
    address: "Film Nagar, Hyderabad",
    coordinates: [17.4131, 78.4144], // Film Nagar approximate coordinates
  },
  {
    id: 7,
    name: "Habitat Cafe",
    address: "Banjara Hills, Hyderabad",
    coordinates: [17.4156, 78.4347], // Banjara Hills approximate coordinates
  },
  {
    id: 8,
    name: "Salt",
    address: "Hitech City, Hyderabad",
    coordinates: [17.4438, 78.3818], // Hitech City approximate coordinates
  },
  {
    id: 9,
    name: "Makau",
    address: "Madhapur, Hyderabad",
    coordinates: [17.4478, 78.3917], // Madhapur approximate coordinates
  },
  {
    id: 10,
    name: "Pizza Express",
    address: "Inorbit Mall, Hyderabad",
    coordinates: [17.4352, 78.3843], // Inorbit Mall approximate coordinates
  },
  {
    id: 11,
    name: "Cafe Mico",
    address: "Dilsukhnagar, Hyderabad",
    coordinates: [17.3689, 78.5248], // Dilsukhnagar approximate coordinates
  },
  {
    id: 12,
    name: "Captain Kunafa",
    address: "Ashoka One Mall, Moosapet, Kukatpally, Hyderabad",
    coordinates: [17.4874, 78.4210], // Kukatpally approximate coordinates
  },
  {
    id: 13,
    name: "Roast's Blueberry Cheesecake",
    address: "Multiple Locations: Roast CCX (Banjara Hills), Roast 24 Seven (Gachibowli), Roast TCC (Madhapur)",
    coordinates: [17.4156, 78.4347], // Banjara Hills approximate coordinates
  },
  {
    id: 14,
    name: "The Matter of Batter",
    address: "Banjara Hills, Hyderabad",
    coordinates: [17.4156, 78.4347], // Banjara Hills approximate coordinates
  },
  {
    id: 15,
    name: "Ghrelin Cafe and Patisserie",
    address: "Jubilee Hills, Hyderabad",
    coordinates: [17.4239, 78.4079], // Jubilee Hills approximate coordinates
  },
  {
    id: 16,
    name: "Concu",
    address: "Jubilee Hills, Hyderabad",
    coordinates: [17.4239, 78.4079], // Jubilee Hills approximate coordinates
  },
  {
    id: 17,
    name: "Labonel Fine Baking",
    address: "Gachibowli, Hyderabad",
    coordinates: [17.4401, 78.3489], // Gachibowli approximate coordinates
  },
  {
    id: 18,
    name: "Feranoz Patisserie and Café",
    address: "Banjara Hills, Hyderabad",
    coordinates: [17.4156, 78.4347], // Banjara Hills approximate coordinates
  },
  {
    id: 19,
    name: "Churrolto",
    address: "Jubilee Hills, Hyderabad",
    coordinates: [17.4239, 78.4079], // Jubilee Hills approximate coordinates
  },
  {
    id: 20,
    name: "Van Lavino Cafe & Patisserie",
    address: "Jubilee Hills, Hyderabad",
    coordinates: [17.4239, 78.4079], // Jubilee Hills approximate coordinates
  },
  {
    id: 21,
    name: "Vac's",
    address: "Jubilee Hills, Hyderabad",
    coordinates: [17.4239, 78.4079], // Jubilee Hills approximate coordinates
  },
  {
    id: 22,
    name: "Harley's Fine Baking",
    address: "Hyderabad",
    coordinates: [17.3850, 78.4867], // Central Hyderabad approximate coordinates
    notes: "Known for their Biscoff cheesecake.",
  },
  {
    id: 23,
    name: "Paul's",
    address: "Hyderabad",
    coordinates: [17.3850, 78.4867], // Central Hyderabad approximate coordinates
    notes: "Highly recommended for its cheesecakes.",
  },
  {
    id: 24,
    name: "IKEA Hyderabad",
    address: "Hyderabad",
    coordinates: [17.4277, 78.3755], // IKEA approximate coordinates
    notes: "Surprisingly, IKEA's café offers well-loved cheesecakes.",
  },
]; 