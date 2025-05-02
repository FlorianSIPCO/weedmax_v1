import { Product, ProductOption, ProductVariant, Option } from "@/generated/prisma";

export interface ProductData {
  name: string;
  images: UploadedImage[]; // URLs Cloudinary
  specs: { key: string; value: string }[];
  description: string;
  stock: number;
  categoryId: string;
  options: {
    optionId: string;
    variants: { quantity: number; price: number }[];
  }[];
  isNew?: boolean | null;
  isPromo?: boolean | null;
  promoPercentage?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
}

export interface ProductUpdateData {
  name?: string;
  images?: { url: string; public_id: string }[];
  specs?: { key: string; value: string }[];
  description?: string;
  stock?: number;
  categoryId?: string;
  options?: {
    optionId: string;
    id?: string;
    name: string;
    variants: {id?: string, quantity: number; price: number }[];
  }[];
  isNew?: boolean | null;
  isPromo?: boolean | null;
  promoPercentage?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
}

export interface ProductWithOptions extends Product {
  images: {
    url: string;
    public_id: string;
  }[];
  options: (ProductOption & {
    option: Option;
    variants: ProductVariant[];
  })[];
  category?: { id: string; name: string; };
  isNew: boolean | null;
  isPromo: boolean | null;
  promoPercentage: number | null;
  rating: number | null;
  reviewCount: number | null;
}

export interface OptionInput {
  productId: string;           // Produit parent
  name: string;                // CBD / MCP‑N / …
  variants: {
    quantity: number;
    price: number;
  }[];
}

export interface OptionWithVariants extends ProductOption {
  variants: ProductVariant[];
}

export type UploadedImage = {
  url: string;
  public_id: string;
};
  