import { SetMetadata } from '@nestjs/common';

import { IS_SKIP_FARM_AUTH } from '../constants';

export const SkipFarmAuth = () => SetMetadata(IS_SKIP_FARM_AUTH, true);
