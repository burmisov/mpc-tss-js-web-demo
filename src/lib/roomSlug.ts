const random4Chars = () => Math.random().toString(36).substring(2, 6);

export const randomRoomSlug = () => {
  return `${random4Chars()}-${random4Chars()}-${random4Chars()}`;
};

export const isValidRoomSlug = (slug: string) => {
  return /^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/.test(slug);
}
