export interface PretalxEvent {
  name: { en: string };
  slug: string;
  is_public: boolean;
  date_from: string;
  date_to: string;
  timezone: string;
  location?: string;
  url: string;
}
