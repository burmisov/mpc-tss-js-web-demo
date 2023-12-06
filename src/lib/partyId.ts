import { randomPartyId } from './randomPartyId';

const LS_KEY = 'mpc_partyId';

export function usePartyId(): string {
  let partyId: string;
  const storedId = localStorage.getItem(LS_KEY);
  if (!storedId) {
    const newpartyId = randomPartyId();
    localStorage.setItem(LS_KEY, newpartyId);
    partyId = newpartyId;
  } else {
    partyId = storedId;
  }

  return partyId;
}
