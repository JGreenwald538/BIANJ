export interface Place extends Document {
  name: string;
  reviews: string[];
  streetAddress: string;
  city: string;
  zip: string;
  long: number; // Assuming this is for longitude
  lat: number;  // Assuming this is for latitude
  website: string;
  phone: string;
  image: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  typeOfPlace: string;
  invisible: boolean;
  state: string;
}