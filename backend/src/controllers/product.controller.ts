import type { Request, Response } from 'express';
import Product from '../models/Product.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, imageUrl, stock } = req.body;
    const product = new Product({ name, description, price, imageUrl, stock });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(500).json({ message: 'Product Creation Failed', error: error.message });
  }
};