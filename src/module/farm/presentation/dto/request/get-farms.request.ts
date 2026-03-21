import { GetFarmsQuery } from '@app/module/farm/application';

export class GetFarmsRequest {
  toQuery(userId: string): GetFarmsQuery {
    return {
      userId,
    };
  }
}
