import { adjectives, names, uniqueNamesGenerator } from 'unique-names-generator';

export const randomPartyId = (): string => {
  const randomId = uniqueNamesGenerator({
    dictionaries: [adjectives, names],
    length: 2,
    separator: ' ',
    style: 'lowerCase',
  });
  return randomId;
}
