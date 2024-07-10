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
    props.forEach((prop) => {
      if (prop.includes(".")) {
        const [parent, child] = prop.split(".");
        if (obj[child]) delete obj[parent][child];
      }

      delete obj[prop];
    });
  } else delete obj[props];

  return obj;
};

/** Generates unique `uuid` */
export const generateId = () => {
  return uuid();
};
