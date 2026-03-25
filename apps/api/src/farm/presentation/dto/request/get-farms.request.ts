import { ContextUser } from '@apps/api/context';
import { GetFarmsQuery } from '@apps/api/farm/application';

export class GetFarmsRequest {
  toQuery(contextUser: ContextUser): GetFarmsQuery {
    return {
      userId: contextUser.userId,
    };
  }
}
