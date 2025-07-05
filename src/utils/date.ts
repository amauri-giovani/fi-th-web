import { format, parseISO, parse, isValid } from "date-fns";


export function dateToString(isoDate?: string): string {
  if (!isoDate || isNaN(Date.parse(isoDate))) return "";
  return format(parseISO(isoDate), "dd/MM/yyyy");
}

export function stringToDate(dateBr: string): string {
  if (!dateBr || dateBr.trim() === "") return "";

  let parsed;

  if (/^\d{8}$/.test(dateBr)) {
    parsed = parse(dateBr, "ddMMyyyy", new Date());
  } else {
    parsed = parse(dateBr, "dd/MM/yyyy", new Date());
  }

  if (!isValid(parsed)) return "";

  return format(parsed, "yyyy-MM-dd");
}
