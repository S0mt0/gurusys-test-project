/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
}

/**
 * Function obscures an email address
 * @param email string
 * @example 's******@gmail.com'
 * @returns Obscured email
 */
export const obscureEmail = (email: string) => {
  if (email) {
    const [name, domain] = email.split("@");
    const l = name.length;
    if (l > 2) {
      return `${name[0]}${new Array(l - 1).join("*")}${name[l - 1]}@${domain}`;
    } else {
      return `${name[0]}${new Array(l).join("*")}@${domain}`;
    }
  }
};

/**
 * Removes a property or properties contained in an array of properties from a provided object
 * @param obj
 * @param props
 */
export const removeObjectProps = (
  obj: Record<string, any>,
  props: string | string[]
) => {
  if (Array.isArray(props)) {
    props.forEach((prop) => delete obj[prop]);
  } else delete obj[props];

  return obj;
};

/**
 * Multiplies all the number arguments and returns their product
 * @param args Numbers
 * @returns Product of the passed in numbers
 */
export const multiply = (...args: number[]) => {
  if (args.length === 0) {
    return 0; // If no numbers are provided, return 0
  }

  return args.reduce(
    (accumulator, currentValue) => accumulator * currentValue,
    1
  );
};

/**
 * Adds up all the provided number and returns their `sum`
 * @param args Numbers
 * @returns Sum of the passed in numbers
 */
export const sum = (...args: number[]) => {
  if (args.length === 0) {
    return 0; // If no numbers are provided, return 0
  }

  return args.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
};

/** Generates unique `uuid` */
export const generateId = () => {
  return uuid();
};

//==================START OF CUSTOM GLOBAL EXTENSIONS=================
globalThis.ls = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

globalThis.lsJson = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

globalThis.xls = (key: string) => {
  localStorage.removeItem(key);
};

globalThis.lsg = (key: string) => {
  return localStorage.getItem(key);
};

globalThis.lsgParse = (key: string) => {
  return JSON.parse(localStorage.getItem(key) ?? "");
};
//===================END OF CUSTOM GLOBAL EXTENSIONS===================
