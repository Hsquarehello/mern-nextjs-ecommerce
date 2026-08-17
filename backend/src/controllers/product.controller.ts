import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import Product from "../models/Product.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = createProductSchema.parse(req.body);

    const product = await Product.create(validatedData);

    console.log(`[PRODUCT] Product created successfully: ID ${product._id}`);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  },
);

// @desc    Get all products (with optional filtering & pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  const skip = (page - 1) * limit;

  const category = req.query.category as string;
  const search = req.query.search as string;

  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const [products, total] = await Promise.all([
    Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(query),
  ]);

  console.log(`[PRODUCT] Fetched ${products.length} products (Page ${page})`);

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  },
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updateProductSchema.parse(req.body);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    console.log(`[PRODUCT] Product updated: ID ${product._id}`);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  },
);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    console.log(`[PRODUCT] Product deleted: ID ${product._id}`);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  },
);
