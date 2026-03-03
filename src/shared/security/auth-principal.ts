export class AuthPrincipal {
  constructor(
    readonly id: string,
    readonly farmId: string | null,
  ) {}
}

export class AuthFarmPrincipal {
  constructor(
    readonly id: string,
    readonly farmId: string,
  ) {}
}
