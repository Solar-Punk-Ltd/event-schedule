import dotenv from "dotenv";

dotenv.config();

export const BEE_API_URL = process.env.BEE_API_URL || "http://localhost:1633/";
export const FEED_OWNER_ADDRESS = process.env.FEED_OWNER_ADDRESS || "";
export const FEED_TOPIC = process.env.FEED_TOPIC || "sessions";
export const STAMP = process.env.STAMP || "";
export const MAINNET_PK = process.env.MAINNET_PK || "";
export const DEVCON_VERSION_API_URL = process.env.DEVCON_VERSION_API_URL || "";
export const DEVCON_SESSIONS_API_URL =
  process.env.DEVCON_SESSIONS_API_URL || "";
export const EVENT_START_DATE = process.env.EVENT_START_DATE || "";
export const EVENT_END_DATE = process.env.EVENT_END_DATE || "";
export const UPDATE_PERIOD_MINUTES = Number(
  process.env.UPDATE_PERIOD_MINUTES || 15
);
