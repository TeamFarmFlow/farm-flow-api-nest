import { GetRolesQuery } from '@app/module/role/application';

export class GetRolesRequest {
  toQuery(farmId: string): GetRolesQuery {
    return { farmId };
  }
}
