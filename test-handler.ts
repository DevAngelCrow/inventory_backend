import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { GetProductsHandler } from './src/modules/inventory/application/product/queries/get-products/get-products.handler';
import { GetProductsQuery } from './src/modules/inventory/application/product/queries/get-products/get-products.query';
import { PaginationParamsDto } from './src/shared/application/dtos/pagination.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const handler = app.get(GetProductsHandler);
  const query = new GetProductsQuery(
    { page: 1, per_page: 10 } as any,
    undefined,
    undefined,
    undefined,
    true
  );
  try {
    const result = await handler.execute(query);
    console.log('Products OK');
  } catch (error) {
    console.error('Handler Error:', error);
  }
  await app.close();
}
bootstrap();
