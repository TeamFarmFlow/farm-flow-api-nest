import { default as datetime } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

datetime.extend(utc);
datetime.extend(timezone);

export { datetime };
