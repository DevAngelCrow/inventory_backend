import { CustomerId } from '../value-objects/customer-id';
import { CustomerName } from '../value-objects/customer-name';
import { CustomerContact } from '../value-objects/customer-contact';
import { CustomerAddress } from '../value-objects/customer-address';

export class Customer {
  constructor(
    private readonly name: CustomerName,
    private readonly contact: CustomerContact,
    private readonly company_name: string | undefined,
    private readonly tax_id: string | undefined,
    private readonly address: CustomerAddress,
    private readonly notes: string | undefined,
    private readonly active: boolean,
    private readonly id_user: string | undefined,
    private readonly id?: CustomerId,
  ) {}

  static create(data: {
    first_name: string;
    last_name: string;
    email?: string;
    phone: string;
    phone_secondary?: string;
    company_name?: string;
    tax_id?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    notes?: string;
    active: boolean;
    id_user?: string;
    id?: string;
  }): Customer {
    return new Customer(
      new CustomerName(data.first_name, data.last_name),
      new CustomerContact(data.phone, data.email, data.phone_secondary),
      data.company_name,
      data.tax_id,
      new CustomerAddress(
        data.address_line1,
        data.address_line2,
        data.city,
        data.state,
        data.zip_code,
      ),
      data.notes,
      data.active,
      data.id_user,
      data.id ? new CustomerId(data.id) : undefined,
    );
  }

  public getId(): CustomerId | undefined { return this.id; }
  public getName(): CustomerName { return this.name; }
  public getContact(): CustomerContact { return this.contact; }
  public getAddress(): CustomerAddress { return this.address; }
  public getCompanyName(): string | undefined { return this.company_name; }
  public getTaxId(): string | undefined { return this.tax_id; }
  public getNotes(): string | undefined { return this.notes; }
  public getActive(): boolean { return this.active; }
  public getIdUser(): string | undefined { return this.id_user; }
}
