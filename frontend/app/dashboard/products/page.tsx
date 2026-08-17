"use client";

import { useState, useEffect, ChangeEvent, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { getProductImageUrl } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const limit = 8; // တစ်မျက်နှာလျှင် ပြသမည့် ပမာဏ

  // Delete Dialog States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Products တောင်းယူသည့် Function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/products`, {
        params: {
          page,
          limit,
          search: searchTerm,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setProducts(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalProducts(res.data.totalProducts || 0);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  // Page သို့မဟုတ် Search ရိုက်လိုက်တိုင်း Data ပြန်ဆွဲခြင်း
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400); // Search debounce 400ms

    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

  // Product ဖျက်သည့် Function
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:5000/api/products/${deleteId}`, {
        withCredentials: true,
      });

      // ဖျက်ပြီးပါက List ကို Update ပြန်လုပ်ခြင်း
      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Products Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your store's inventory, prices, and stock.
          </p>
        </div>
        <Button
          render={<Link href="/dashboard/products/new" />}
          className="gap-2">
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setPage(1); // Search ရိုက်ရင် Page 1 ကို ပြန်သွားမည်
          }}
          className="pl-9"
        />
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading products...
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Package className="h-8 w-8 stroke-1" />
                    <p>No products found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                // Image URL ရယူခြင်း (Type Guard သေချာ ထည့်ထားပါသည်)
                let imageUrl = getProductImageUrl(product.images);

                return (
                  <TableRow key={product._id}>
                    {/* Image */}
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted border">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    </TableCell>

                    {/* Name */}
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {product.category}
                      </Badge>
                    </TableCell>

                    {/* Price */}
                    <TableCell>${product.price.toFixed(2)}</TableCell>

                    {/* Stock */}
                    <TableCell>
                      {product.stock > 0 ? (
                        <span className="text-xs text-emerald-600 bg-emerald-50 font-medium px-2 py-1 rounded-full border border-emerald-200">
                          In Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="text-xs text-rose-600 bg-rose-50 font-medium px-2 py-1 rounded-full border border-rose-200">
                          Out of Stock
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          render={
                            <Link
                              href={`/dashboard/products/${product._id}/edit`}
                            />
                          }
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8">
                          <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => setDeleteId(product._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{products.length}</span> of{" "}
          <span className="font-medium">{totalProducts}</span> products
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || loading}
            className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          <span className="text-sm text-muted-foreground px-2">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || loading}
            className="gap-1">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your store inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white">
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Product"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
