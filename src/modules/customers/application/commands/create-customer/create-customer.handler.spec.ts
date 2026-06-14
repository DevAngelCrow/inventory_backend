import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerHandler } from './create-customer.handler';
import { CustomerRepository } from '@/modules/customers/domain/repositories/customer-repository';
import { CreateCustomerCommand } from './create-customer.command';
import { Customer } from '@/modules/customers/domain/entities/customer';

describe('CreateCustomerHandler', () => {
  let handler: CreateCustomerHandler;
  let repository: jest.Mocked<CustomerRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomerHandler,
        {
          provide: CustomerRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateCustomerHandler>(CreateCustomerHandler);
    repository = module.get(CustomerRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call repository.create with correct customer entity', async () => {
    const command = new CreateCustomerCommand(
      'John',
      'Doe',
      '+123456789',
      'john.doe@example.com',
      undefined,
      'ACME Corp',
    );

    await handler.execute(command);

    expect(repository.create).toHaveBeenCalledTimes(1);
    const createdCustomer = repository.create.mock.calls[0][0] as Customer;
    expect(createdCustomer.getName().firstName).toBe('John');
    expect(createdCustomer.getName().lastName).toBe('Doe');
    expect(createdCustomer.getContact().phone).toBe('+123456789');
    expect(createdCustomer.getContact().email).toBe('john.doe@example.com');
    expect(createdCustomer.getCompanyName()).toBe('ACME Corp');
  });
});
