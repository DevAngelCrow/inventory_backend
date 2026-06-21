import { CustomerId } from '../value-objects/customer-id';
import { CustomerName } from '../value-objects/customer-name';
import { CustomerContact } from '../value-objects/customer-contact';
import { CustomerAddress } from '../value-objects/customer-address';

export class Customer {
  constructor(
    private readonly name: CustomerName,
    private readonly contact: CustomerContact,
    private readonly id_country: string,
    private readonly company_name: string | undefined,
    private readonly tax_id: string | undefined,
    private readonly addresses: CustomerAddress[],
    private readonly notes: string | undefined,
    private readonly active: boolean,
    private readonly id?: CustomerId,
  ) {}

  static create(data: {
    first_name: string;
    last_name: string;
    middle_name?: string;
    email?: string;
    phone: string;
    phone_secondary?: string;
    company_name?: string;
    tax_id?: string;
    notes?: string;
    active: boolean;
    id_country: string;
    addresses?: {
      label: string;
      address_line1: string;
      address_line2?: string;
      zip_code?: string;
      is_primary: boolean;
      id_geographic_division?: string;
      id?: string;
      active?: boolean;
    }[];
    id?: string;
  }): Customer {
    const addresses = data.addresses ? data.addresses.map(a => new CustomerAddress(
      a.label,
      a.address_line1,
      a.is_primary,
      a.address_line2,
      a.zip_code,
      a.id_geographic_division,
      a.id,
      a.active,
    )) : [];

    return new Customer(
      new CustomerName(data.first_name, data.last_name, data.middle_name),
      new CustomerContact(data.phone, data.email, data.phone_secondary),
      data.id_country,
      data.company_name,
      data.tax_id,
      addresses,
      data.notes,
      data.active,
      data.id ? new CustomerId(data.id) : undefined,
    );
  }

  public getId(): CustomerId | undefined { return this.id; }
  public getName(): CustomerName { return this.name; }
  public getContact(): CustomerContact { return this.contact; }
  public getAddresses(): CustomerAddress[] { return this.addresses; }
  public getCompanyName(): string | undefined { return this.company_name; }
  public getTaxId(): string | undefined { return this.tax_id; }
  public getNotes(): string | undefined { return this.notes; }
  public getActive(): boolean { return this.active; }
  public getIdCountry(): string { return this.id_country; }
}
