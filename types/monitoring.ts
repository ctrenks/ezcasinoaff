export interface CasinoChange {
  id: number;
  casino: string | null;
  url: string | null;
  timestamp: number | null;
}

export interface UserChange {
  id: string;
  name: string | null;
  email: string;
}

export interface SystemChanges {
  newUsers: UserChange[];
  newCasinos: CasinoChange[];
  urlChanges: CasinoChange[];
} 