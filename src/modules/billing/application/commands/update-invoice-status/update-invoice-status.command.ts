export class UpdateInvoiceStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: string,
  ) {}
}
