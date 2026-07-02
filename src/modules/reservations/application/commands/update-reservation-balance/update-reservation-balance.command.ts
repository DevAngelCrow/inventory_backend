export class UpdateReservationBalanceCommand {
  constructor(
    public readonly id: string,
    public readonly balance_due_delta: number, // Positive adds to balance, negative subtracts
    public readonly deposit_amount_delta: number, // Positive adds to deposit, negative subtracts
  ) {}
}
