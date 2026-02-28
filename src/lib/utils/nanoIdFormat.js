import { customAlphabet } from "nanoid";

export const nanoIdFormat = (init) => {
  const date = new Date().toLocaleDateString().replace(/\//g, '');

  const nanoid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    15,
  );

  return `${init}${date}${nanoid()}`;
};