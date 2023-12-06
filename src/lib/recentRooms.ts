type RecentRooms = Array<string>;

const LS_KEY = 'mpc_recentRooms';
const MAX_RECENT_ROOMS = 5;

const getLsRooms = (): RecentRooms => {
  const recentRooms = localStorage.getItem(LS_KEY);
  if (recentRooms) {
    return JSON.parse(recentRooms);
  }
  return [];
};

export const useRecentRooms = (): RecentRooms => {
  const recentRooms = getLsRooms();
  return recentRooms;
};

export const setRecentRoom = (room: string) => {
  const recentRooms = getLsRooms();

  const newRecentRooms = [
    room,
    ...recentRooms.filter(r => r !== room)
  ].slice(0, MAX_RECENT_ROOMS);

  localStorage.setItem(LS_KEY, JSON.stringify(newRecentRooms));
};
