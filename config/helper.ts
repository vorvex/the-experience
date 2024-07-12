export type Translation<T extends {}> = {
  [lang: string]: T;
};

export function getMedia(
  media: string | null | Record<string, string>,
  language: string
): string | null {
  if (!media) {
    return null;
  }
  if (typeof media === 'string') {
    return media;
  }
  return (
    media[language] || media['default'] || media['en'] || media['de'] || null
  );
}

export function blockToTime(block: number) {
  let hours = Math.floor(block / 4),
    minutes = (block % 4) * 15;

  if (hours >= 24) {
    hours = hours - 24;
  }

  return `${pad(hours.toString())}:${pad(minutes.toString())}`;
}

export function timeToBlock(time: string) {
  let [hours, minutes] = time.split(':');
  return parseInt(hours) * 4 + parseInt(minutes) / 15;
}

export const stringToId = (str: any) => {
  return (
    str
      .toLocaleLowerCase()
      .replace(/ö/gm, 'oe')
      .replace(/ü/gm, 'ue')
      .replace(/ä/gm, 'ae')
      .replace(/ß/gm, 'ss')
      .replace(/(\<|\>|\/|\&|\?|\=|\,|\.|\!|\%|\?|\`|\'|\"|\;|\:)/gm, '')
      .replace('/', '-')
      // .replace(/\W/g, "")//@This line delete all "-" in the id and replace them with ""
      .replaceAll(' ', '-')
  );
};

export const createRandomId = (length = 4, upperAndLowerCase = false) => {
  const arr = Array.from(
    upperAndLowerCase
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  );

  var id = '';

  for (var i = 0; i < length; i++) {
    id += arr[Math.round(Math.random() * (arr.length - 1))];
  }

  return id;
};

export function getTranslation<T extends {}>(
  language: string,
  translations: Translation<T> | undefined | null,
  key: keyof T,
  defaultString: string
): string {
  let translation = translations?.[language];

  let notGerman = language !== 'de';

  if (notGerman) {
    translation = translations?.['en'];
  }

  if (!translation) {
    return defaultString;
  }

  return (translation as any)[key] ?? defaultString;
}

export function pad(n: string, len = 2) {
  return n.padStart(len, '0');
}

export function daysBetween(startDate: Date, endDate: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const start = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  return (end - start) / oneDay;
}

export function getDate(timeZone = 'Europe/Berlin', date = new Date()): string {
  const [mm, dd, yyyy] = date
    .toLocaleString('en-US', { timeZone })
    .split(',')[0]
    .split('/');
  return `${yyyy}-${pad(mm)}-${pad(dd)}`;
}

export function getDifferenceInMinutes(
  timeZone = 'Europe/Berlin',
  firstDate: string,
  lastDate: string
): number {
  let a = getDate(timeZone, new Date(firstDate)),
    b = getDate(timeZone, new Date(lastDate));

  let difference = daysBetween(new Date(a), new Date(b)) * 60 * 24;

  let timeA = timeToBlock(firstDate.split('T')[1] || '00:00'),
    timeB = timeToBlock(lastDate.split('T')[1] || '00:00');

  difference += (timeB - timeA) * 15;

  return difference;
}

export function getTime(
  timeZone = 'Europe/Berlin',
  date = new Date(),
  showSeconds = false
) {
  const [hours, minutes, seconds] = date
    .toLocaleString('de-DE', { timeZone })
    .split(', ')[1]
    .split(':');
  if (showSeconds) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(hours)}:${pad(minutes)}`;
}

export function getCurrentTime(
  timeZone = 'Europe/Berlin',
  showSeconds = false
) {
  const [hours, minutes, seconds] = new Date()
    .toLocaleString('de-DE', { timeZone })
    .split(', ')[1]
    .split(':');
  if (showSeconds) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(hours)}:${pad(minutes)}`;
}

export function daysInFuture(
  days: number,
  timeZone = 'Europe/Berlin',
  date = getDate(timeZone)
): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return getDate(timeZone, d);
}

export function getNextXDays(days: number, timeZone = 'Europe/Berlin') {
  const dates = [];
  for (let i = 0; i < days; i++) {
    dates.push(daysInFuture(i, timeZone));
  }
  return dates;
}

export function dateIsTodayOrInFuture(
  date: string,
  timeZone = 'Europe/Berlin'
) {
  return date >= getDate(timeZone);
}

export function getWeekdayString(date: string) {
  const wDay = new Date(date).getDay();

  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][wDay];
}
