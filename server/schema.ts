import mongoose, { Document, Schema } from 'mongoose';
import type {Place} from '../lib/place';
// Define the schema for places

const placeSchema = new Schema<Place>({
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
const Place = mongoose.model<Place>('Place', placeSchema);

export default Place;
