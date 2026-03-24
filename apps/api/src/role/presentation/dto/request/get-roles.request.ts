import { GetRolesQuery } from '@apps/api/role/application';

export class GetRolesRequest {
  toQuery(farmId: string): GetRolesQuery {
    return { farmId };
  }
}
