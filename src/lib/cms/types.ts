export type ActivityCategory = "Move" | "Recover" | "Connect";
export type ActivityIntensity = "Gentle" | "Moderate" | "High";

export type CmsImage = {
  url: string;
  alt: string;
};

export type Club = {
  id: string;
  name: string;
  slug: string;
  city: string;
  summary: string;
  address: string;
  facilities: string[];
  heroImage?: CmsImage;
};

export type Activity = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  details: string;
  category: ActivityCategory;
  intensity: ActivityIntensity;
  durationMinutes: number;
  heroImage?: CmsImage;
  clubs: Club[];
};

export type ClubWithActivities = Club & {
  activities: Activity[];
};

export type WellnessContent = {
  activities: Activity[];
  clubs: Club[];
};
