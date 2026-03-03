import { GetRolesQuery } from '@app/feature/role/application';

export class GetRolesRequest {
  toQuery(farmId: string): GetRolesQuery {
    return { farmId };
  }
}
