/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */

declare global {
  /** Custom function that minifies `localStorage.setItem(key: string, value: string)` */
  var ls: (key: string, value: string) => void;

  /** Custom function that minifies `localStorage.setItem(key: string, value: JSON.stringify(data))` */
  var lsJson: (key: string, value: any) => void;

  /** Custom function that minifies `localStorage.removeItem(key: string)` */
  var xls: (key: string) => void;

  /** Custom function that minifies `localStorage.getItem(key: string)` */
  var lsg: (key: string) => string | null;

  /** Custom function that minifies `JSON.parse(localStorage.getItem(key: string) ?? "")` */
  var lsgParse: <T>(key: string) => T = any | null;
}

export {};
