import { hour, minute, second } from '~/constants/time';

/**
 * @time `'hours:minutes:seconds:milliseconds'`
 */
export const timeStringToMs = (time: string) => {
  const [hours = 0, mins = 0, secs = 0, ms = 0] = time.split(':');

  const hoursInMs = +hours * hour;
  const minsInMs = +mins * minute;
  const secsInMs = +secs * second;

  return hoursInMs + minsInMs + secsInMs + +ms;
};
