import { GetFarmsQuery } from '@app/feature/farm/application';

export class GetFarmsRequest {
  toQuery(userId: string): GetFarmsQuery {
    return {
      userId,
    };
  }
}
