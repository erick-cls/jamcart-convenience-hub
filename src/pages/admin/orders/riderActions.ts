
import { Rider } from './types';
import { mockRiders } from './mockData';

// Get available riders
export const getAvailableRiders = (riders: Rider[]): Rider[] => {
  return riders.filter(rider => rider.isAvailable);
};
