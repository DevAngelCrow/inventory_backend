import { ProductId } from '../value-objects/product-value-object/product-id';
import { ProductSku } from '../value-objects/product-value-object/product-sku';
import { ProductName } from '../value-objects/product-value-object/product-name';
import { ProductDescription } from '../value-objects/product-value-object/product-description';
import { ProductPrice } from '../value-objects/product-value-object/product-price';
import { ProductStock } from '../value-objects/product-value-object/product-stock';
import { ProductCategoryId } from '../value-objects/product-category-value-object/product-category-id';

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
    private readonly color: string | undefined,
    private readonly dimensions: string | undefined,
    private readonly weight_lbs: number | undefined,
    private readonly image_url: string | undefined,
    private readonly notes: string | undefined,
    private readonly active: boolean,
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
      data.color,
      data.dimensions,
      data.weight_lbs,
      data.image_url,
      data.notes,
      data.active,
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
  public getColor(): string | undefined { return this.color; }
  public getDimensions(): string | undefined { return this.dimensions; }
  public getWeightLbs(): number | undefined { return this.weight_lbs; }
  public getImageUrl(): string | undefined { return this.image_url; }
  public getNotes(): string | undefined { return this.notes; }
  public getActive(): boolean { return this.active; }
}
