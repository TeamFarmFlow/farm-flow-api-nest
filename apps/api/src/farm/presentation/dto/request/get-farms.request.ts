import { GetFarmsQuery } from '@apps/api/farm/application';

export class GetFarmsRequest {
  toQuery(userId: string): GetFarmsQuery {
    return {
      userId,
    };
  }
}
