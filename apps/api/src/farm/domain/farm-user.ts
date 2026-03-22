import { Farm } from './farm';
import { FarmRole } from './farm-role';

export class FarmUser {
  farm: Farm;
  role: FarmRole | null;
}
