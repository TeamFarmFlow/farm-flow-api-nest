import { ContextUser } from '@apps/api/context';
import { GetRolesQuery } from '@apps/api/role/application';

export class GetRolesRequest {
  toQuery(contextUser: ContextUser): GetRolesQuery {
    return { farmId: contextUser.farmId };
  }
}
