import { CustomerId } from '../value-objects/customer-id';
import { CustomerName } from '../value-objects/customer-name';
import { CustomerContact } from '../value-objects/customer-contact';
import { CustomerAddress } from '../value-objects/customer-address';
import { CustomerCountryId } from '../value-objects/customer-country-id';
import { CustomerCompanyName } from '../value-objects/customer-company-name';
import { CustomerTaxId } from '../value-objects/customer-tax-id';
import { CustomerNotes } from '../value-objects/customer-notes';
import { CustomerActive } from '../value-objects/customer-active';

export class Customer {
  constructor(
    private readonly name: CustomerName,
    private readonly contact: CustomerContact,
    private readonly id_country: CustomerCountryId,
    private readonly company_name: CustomerCompanyName | undefined,
    private readonly tax_id: CustomerTaxId | undefined,
    private readonly addresses: CustomerAddress[],
    private readonly notes: CustomerNotes | undefined,
    private readonly active: CustomerActive,
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
      new CustomerCountryId(data.id_country),
      data.company_name ? new CustomerCompanyName(data.company_name) : undefined,
      data.tax_id ? new CustomerTaxId(data.tax_id) : undefined,
      addresses,
      data.notes ? new CustomerNotes(data.notes) : undefined,
      new CustomerActive(data.active),
      data.id ? new CustomerId(data.id) : undefined,
    );
  }

  public getId(): CustomerId | undefined { return this.id; }
  public getName(): CustomerName { return this.name; }
  public getContact(): CustomerContact { return this.contact; }
  public getAddresses(): CustomerAddress[] { return this.addresses; }
  public getCompanyName(): CustomerCompanyName | undefined { return this.company_name; }
  public getTaxId(): CustomerTaxId | undefined { return this.tax_id; }
  public getNotes(): CustomerNotes | undefined { return this.notes; }
  public getActive(): CustomerActive { return this.active; }
  public getIdCountry(): CustomerCountryId { return this.id_country; }
}
