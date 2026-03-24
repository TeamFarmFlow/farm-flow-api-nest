export class AuthPrincipal {
  constructor(
    readonly id: string,
    readonly farmId: string | null,
  ) {}
}
