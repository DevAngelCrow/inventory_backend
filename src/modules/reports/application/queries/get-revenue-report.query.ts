export class GetRevenueReportQuery {
  constructor(
    public readonly start_date: Date,
    public readonly end_date: Date,
  ) {}
}
