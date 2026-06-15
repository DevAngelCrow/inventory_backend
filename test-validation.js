require('ts-node').register({ transpileOnly: true });
require('tsconfig-paths').register();
const { plainToInstance } = require('class-transformer');
const { validateSync } = require('class-validator');
const { GetProductsQueryDto } = require('./src/modules/inventory/infrastructure/dtos/query/get-products-query.dto');

const instance = plainToInstance(GetProductsQueryDto, { active: 'true', per_page: '100' });
console.log('instance:', instance);
const errors = validateSync(instance, { whitelist: true, forbidNonWhitelisted: true });
console.log('errors:', JSON.stringify(errors, null, 2));
