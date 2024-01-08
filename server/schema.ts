import mongoose, { Document, Schema } from 'mongoose';

// Define the schema for places
interface IPlace extends Document {
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
}

const placeSchema = new Schema<IPlace>({
  name: {
    type: String,
    required: true,
  },
  reviews: {
    type: [String],
    default: [],
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  website: {
    type: String,
  },
  phone: {
    type: String,
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

// Create a model for places using the schema
const Place = mongoose.model<IPlace>('Place', placeSchema);

export default Place;
