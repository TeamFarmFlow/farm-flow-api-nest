import { FarmEntity, UserEntity } from '@app/infra/persistence/typeorm';

import { InvitationFarm, InvitationUser } from '../../domain';

export class InvitationTypeOrmMapper {
  static toInvitationFarm(farm: FarmEntity): InvitationFarm {
    const mappedFarm = new InvitationFarm();

    mappedFarm.id = farm.id;
    mappedFarm.name = farm.name;
    mappedFarm.payRatePerHour = farm.payRatePerHour;
    mappedFarm.payDeductionAmount = farm.payDeductionAmount;

    return mappedFarm;
  }

  static toInvitationUser(user: UserEntity): InvitationUser {
    const mappedUser = new InvitationUser();

    mappedUser.id = user.id;
    mappedUser.email = user.email;

    return mappedUser;
  }
}
