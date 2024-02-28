declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "moderator";
    };
  }
}

export type Roles = "admin" | "moderator";
