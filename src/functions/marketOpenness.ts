import { isToday, isTomorrow, lightFormat } from "date-fns";
import { ProfileType, BusinessHour, SpecialDay } from "~/core/types";
import { omit } from "./omit";
import { range } from "./range";
import { timeStringToMs } from "./timeStringToMs";
import { fail } from "./fail";

export const weekDayArray = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;

type NormalizedBHs = Omit<BusinessHour, "days"> & {
  day: number;
};

export const getOpennessMsg = (
  openness: ReturnType<typeof getMarketOpenness>,
) => {
  const { isOpen, nextHour } = openness;
  const openedOrClosed = isOpen ? "Aberto" : "Fechado";

  if (!nextHour) return openedOrClosed;

  const ofTomorrowOfNot = nextHour.isTomorrow ? " de amanhã" : "";
  const earlyOrNot = nextHour.isEarly
    ? ` (${isOpen ? "Abriu" : "Fechou"} mais cedo)`
    : "";

  return `${openedOrClosed} até ${nextHour.time}${ofTomorrowOfNot}${earlyOrNot}`;
};

export const getMarketOpenness = (
  { business_hours, special_days, open_flips }: ProfileType,
  intervalDaysQuantity = 1,
) => {
  const now = new Date();
  const weekday = now.getDay();
  const nowInMs = timeStringToMs(lightFormat(now, "HH:mm"));

  const normalizeBH = (day: number) => (hb: BusinessHour | SpecialDay) => ({
    ...("days" in hb ? omit(hb, "days") : hb),
    day,
  });
  const futureBHs = (() => {
    if (intervalDaysQuantity <= 1) return [];

    const intervalDays = range(1, intervalDaysQuantity - 1).map(
      (n) => (n + weekday) % 7,
    );

    return intervalDays.reduce((list, intervalDay) => {
      const bh = business_hours
        .filter(({ days }) =>
          days.includes(weekDayArray[intervalDay] ?? fail()),
        )
        .map(normalizeBH(intervalDay));

      return list.concat(bh);
    }, [] as NormalizedBHs[]);
  })();

  const todayFlips = open_flips.filter((v) => isToday(v.created_at));
  const flip = todayFlips[0];
  const flipInMs =
    (flip && timeStringToMs(lightFormat(flip.created_at, "HH:mm"))) ?? 0;

  const isClosedByFlip = (openInMs: number) => {
    if (flip?.type === "CLOSE_UNTIL_NEXT_DAY") {
      return flipInMs <= nowInMs;
    }
    if (flip?.type === "CLOSE_UNTIL_NEXT_OPEN") {
      return flipInMs <= nowInMs && flipInMs <= openInMs;
    }
    return false;
  };

  const getTodayFutureBHs = () =>
    business_hours.filter(({ days, open_time, close_time }) => {
      const openInMs = timeStringToMs(open_time);
      const closeInMs = timeStringToMs(close_time);

      const isToday = days.includes(weekDayArray[weekday] ?? fail());
      const isPast = closeInMs <= nowInMs;

      return isToday && !isPast && !isClosedByFlip(openInMs);
    });

  const getTodayFutureSpecialBHs = () =>
    special_days.filter(({ date, open_time, close_time }) => {
      const openInMs = timeStringToMs(open_time);
      const closeInMs = timeStringToMs(close_time);

      const isPast = closeInMs <= nowInMs;

      return isToday(date) && !isPast && !isClosedByFlip(openInMs);
    });

  const todayHasSpecialBH = special_days.some((v) => isToday(v.date));

  const todayFutureBHs = todayHasSpecialBH
    ? getTodayFutureSpecialBHs()
    : getTodayFutureBHs();
  const [todayNextBH] = todayFutureBHs;

  if (todayNextBH) {
    const { open_time, close_time } = todayNextBH;

    const { openedByFlip, openInMs } = (() => {
      const scheduledOpenInMs = timeStringToMs(open_time);

      const openedByFlip =
        flip?.type === "OPEN" && flipInMs < scheduledOpenInMs;

      return {
        openedByFlip,
        openInMs: openedByFlip ? flipInMs : scheduledOpenInMs,
      };
    })();

    const isOpen = openedByFlip || nowInMs >= openInMs;
    return {
      isOpen,
      nextHour: {
        time: trimStartZero(isOpen ? close_time : open_time),
        isTomorrow: false,
        isEarly: openedByFlip,
        flipDate: flip?.created_at,
      },
      intervals: todayFutureBHs.map(normalizeBH(weekday)).concat(futureBHs),
    };
  }

  const tomorrowSpecialBHs = special_days.filter((v) => isTomorrow(v.date));

  const tomorrowWeekday = (weekday + 1) % 7;
  const tomorrowBHs = tomorrowSpecialBHs.length
    ? tomorrowSpecialBHs
    : business_hours.filter(({ days }) =>
        days.includes(weekDayArray[tomorrowWeekday] ?? fail()),
      );
  const [tomorrowNextBH] = tomorrowBHs;

  if (tomorrowNextBH) {
    const { open_time } = tomorrowNextBH;

    return {
      isOpen: false,
      nextHour: {
        time: trimStartZero(open_time),
        isTomorrow: true,
        isEarly: isClosedByFlip(timeStringToMs(open_time)),
        flipDate: flip?.created_at,
      },
      intervals: futureBHs,
    };
  }

  return {
    isOpen: false,
    intervals: futureBHs,
  };
};

const trimStartZero = (text: string) => text.replace(/^.{0}0/, "");
