import { NodeEnv } from '@app/config/enums';

export type HealthResult = {
  name: string;
  version: string;
  env: NodeEnv;
};
