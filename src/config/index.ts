import dotenv from "dotenv";

dotenv.config();

export const BEE_API_URL = process.env.BEE_API_URL || "http://localhost:1633/";
export const FEED_OWNER_ADDRESS = process.env.FEED_OWNER_ADDRESS || "";
export const FEED_TOPIC_SUFIX = process.env.FEED_TOPIC_SUFIX || "sessions";
export const STAMP = process.env.STAMP || "";
export const MAINNET_PK = process.env.MAINNET_PK || "";
export const DEVCON_API_URL = process.env.DEVCON_API_URL || "";
export const PRETALX_API_URL = process.env.PRETALX_API_URL || "";
export const PRETALX_EVENT_IDS = process.env.PRETALX_EVENT_IDS
  ? (JSON.parse(process.env.PRETALX_EVENT_IDS) as string[])
  : [];
export const DEVCON_EVENT_IDS = process.env.DEVCON_EVENT_IDS
  ? (JSON.parse(process.env.DEVCON_EVENT_IDS) as string[])
  : [];
export const UPDATE_PERIOD_MINUTES = Number(
  process.env.UPDATE_PERIOD_MINUTES || 15
);
