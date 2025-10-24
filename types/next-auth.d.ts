import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: number;
      apiKey?: string;
      image?: string | null;
      ezcasino?: boolean;
      allmedia?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role?: number;
    apiKey?: string;
    image?: string | null;
    ezcasino?: boolean;
    allmedia?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: number;
    apiKey?: string;
  }
}
