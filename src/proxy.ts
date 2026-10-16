import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

// `lab` holds English-only design prototypes with their own root layout; keep them out of locale routing.
export const config = { matcher: "/((?!api|_next|_vercel|lab|.*\\..*).*)" };
