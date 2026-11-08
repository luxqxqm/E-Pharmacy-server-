import { NearestStore } from '../models/nearestStores.js';
import { Store } from '../models/stores.js';

export const getStores = async (req, res) => {
  const stores = await Store.find();
  res.status(200).json(stores);
};

export const getNearestStores = async (req, res) => {
  const nearestStores = await NearestStore.find();
  res.status(200).json(nearestStores);
};
