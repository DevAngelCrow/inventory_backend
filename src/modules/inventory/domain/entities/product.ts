import { ProductId } from '../value-objects/product-value-object/product-id';
import { ProductSku } from '../value-objects/product-value-object/product-sku';
import { ProductName } from '../value-objects/product-value-object/product-name';
import { ProductDescription } from '../value-objects/product-value-object/product-description';
import { ProductPrice } from '../value-objects/product-value-object/product-price';
import { ProductStock } from '../value-objects/product-value-object/product-stock';
import { ProductCategoryId } from '../value-objects/product-category-value-object/product-category-id';
import { ProductColor } from '../value-objects/product-value-object/product-color';
import { ProductDimensions } from '../value-objects/product-value-object/product-dimensions';
import { ProductWeightLbs } from '../value-objects/product-value-object/product-weight-lbs';
import { ProductImageUrl } from '../value-objects/product-value-object/product-image-url';
import { ProductNotes } from '../value-objects/product-value-object/product-notes';
import { ProductActive } from '../value-objects/product-value-object/product-active';

export class Product {
  constructor(
    private readonly sku: ProductSku,
    private readonly name: ProductName,
    private readonly description: ProductDescription,
    private readonly rental_price: ProductPrice,
    private readonly replacement_cost: ProductPrice | undefined,
    private readonly total_stock: ProductStock,
    private readonly min_stock_alert: ProductStock,
    private readonly category_id: ProductCategoryId,
    private readonly color: ProductColor,
    private readonly dimensions: ProductDimensions,
    private readonly weight_lbs: ProductWeightLbs,
    private readonly image_url: ProductImageUrl,
    private readonly notes: ProductNotes,
    private readonly active: ProductActive,
    private readonly id?: ProductId,
  ) {}

  static create(data: {
    sku: string;
    name: string;
    description?: string;
    rental_price: number;
    replacement_cost?: number;
    total_stock: number;
    min_stock_alert?: number;
    category_id: string;
    color?: string;
    dimensions?: string;
    weight_lbs?: number;
    image_url?: string;
    notes?: string;
    active: boolean;
    id?: string;
  }): Product {
    return new Product(
      new ProductSku(data.sku),
      new ProductName(data.name),
      new ProductDescription(data.description),
      new ProductPrice(data.rental_price),
      data.replacement_cost !== undefined ? new ProductPrice(data.replacement_cost) : undefined,
      new ProductStock(data.total_stock),
      new ProductStock(data.min_stock_alert ?? 0),
      new ProductCategoryId(data.category_id),
      new ProductColor(data.color),
      new ProductDimensions(data.dimensions),
      new ProductWeightLbs(data.weight_lbs),
      new ProductImageUrl(data.image_url),
      new ProductNotes(data.notes),
      new ProductActive(data.active),
      data.id ? new ProductId(data.id) : undefined,
    );
  }

  public getId(): ProductId | undefined { return this.id; }
  public getSku(): ProductSku { return this.sku; }
  public getName(): ProductName { return this.name; }
  public getDescription(): ProductDescription { return this.description; }
  public getRentalPrice(): ProductPrice { return this.rental_price; }
  public getReplacementCost(): ProductPrice | undefined { return this.replacement_cost; }
  public getTotalStock(): ProductStock { return this.total_stock; }
  public getMinStockAlert(): ProductStock { return this.min_stock_alert; }
  public getCategoryId(): ProductCategoryId { return this.category_id; }
  public getColor(): ProductColor { return this.color; }
  public getDimensions(): ProductDimensions { return this.dimensions; }
  public getWeightLbs(): ProductWeightLbs { return this.weight_lbs; }
  public getImageUrl(): ProductImageUrl { return this.image_url; }
  public getNotes(): ProductNotes { return this.notes; }
  public getActive(): ProductActive { return this.active; }
}
