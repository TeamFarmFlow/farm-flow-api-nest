import { FarmEntity, FarmUserEntity, RoleEntity } from '@libs/persistence/typeorm';

import { Farm, FarmRole, FarmUser } from '../../domain';

export class FarmTypeOrmMapper {
  static toFarm(farm: FarmEntity): Farm {
    const mappedFarm = new Farm();

    mappedFarm.id = farm.id;
    mappedFarm.name = farm.name;
    mappedFarm.payRatePerHour = farm.payRatePerHour;
    mappedFarm.payDeductionAmount = farm.payDeductionAmount;

    return mappedFarm;
  }

  static toFarmRole(role: RoleEntity): FarmRole {
    const mappedRole = new FarmRole();

    mappedRole.id = role.id;
    mappedRole.name = role.name;
    mappedRole.required = role.required;
    mappedRole.super = role.super;

    return mappedRole;
  }

  static toFarmUser(farmUser: FarmUserEntity): FarmUser {
    const mappedFarmUser = new FarmUser();

    mappedFarmUser.farm = FarmTypeOrmMapper.toFarm(farmUser.farm);
    mappedFarmUser.role = farmUser.role ? FarmTypeOrmMapper.toFarmRole(farmUser.role) : null;

    return mappedFarmUser;
  }
}
