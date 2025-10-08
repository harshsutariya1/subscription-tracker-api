import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_API_KEY, ARCJET_ENV } from "../config/env.js";

const aj = arcjet({
  key: ARCJET_API_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({
      mode: ARCJET_ENV === "production" ? "LIVE" : "DRY_RUN"
    }),
    detectBot({
      mode: ARCJET_ENV === "production" ? "LIVE" : "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: ARCJET_ENV === "production" ? "LIVE" : "DRY_RUN",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export default aj;