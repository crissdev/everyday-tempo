import { cacheLife, cacheTag } from "next/cache";

import { sampleContent } from "./sample-content";
import type {
  Activity,
  ActivityCategory,
  ActivityIntensity,
  Club,
  ClubWithActivities,
  CmsImage,
  WellnessContent,
} from "./types";

const CONTENTFUL_CACHE_TAG = "contentful-wellness";

type ContentfulAsset = {
  url?: string | null;
  title?: string | null;
};

type ContentfulClub = {
  sys?: { id?: string | null } | null;
  name?: string | null;
  slug?: string | null;
  city?: string | null;
  summary?: string | null;
  address?: string | null;
  facilities?: Array<string | null> | null;
  heroImage?: ContentfulAsset | null;
};

type ContentfulActivity = {
  sys?: { id?: string | null } | null;
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  details?: string | null;
  category?: string | null;
  intensity?: string | null;
  durationMinutes?: number | null;
  heroImage?: ContentfulAsset | null;
  availableAtCollection?: {
    items?: Array<ContentfulClub | null> | null;
  } | null;
};

type ContentfulResponse = {
  data?: {
    activityCollection?: { items?: Array<ContentfulActivity | null> | null } | null;
    clubCollection?: { items?: Array<ContentfulClub | null> | null } | null;
  };
  errors?: Array<{ message?: string }>;
};

type ContentfulConfig = {
  spaceId: string;
  accessToken: string;
  environment: string;
};

const wellnessQuery = `
  query WellnessContent {
    clubCollection(limit: 50, order: name_ASC) {
      items {
        sys { id }
        name
        slug
        city
        summary
        heroImage { url title }
      }
    }
    activityCollection(limit: 100, order: title_ASC) {
      items {
        sys { id }
        title
        slug
        summary
        details
        category
        intensity
        durationMinutes
        heroImage { url title }
        availableAtCollection(limit: 20) {
          items {
            sys { id }
            name
            slug
            city
            summary
            heroImage { url title }
          }
        }
      }
    }
  }
`;

function required(value: string | null | undefined, field: string): string {
  if (!value) {
    throw new Error(`Contentful returned an entry without a required ${field} field.`);
  }

  return value;
}

function mapImage(asset: ContentfulAsset | null | undefined): CmsImage | undefined {
  if (!asset?.url) return undefined;

  return {
    url: asset.url.startsWith("//") ? `https:${asset.url}` : asset.url,
    alt: asset.title || "",
  };
}

function mapClub(entry: ContentfulClub): Club {
  return {
    id: required(entry.sys?.id, "club id"),
    name: required(entry.name, "club name"),
    slug: required(entry.slug, "club slug"),
    city: required(entry.city, "club city"),
    summary: required(entry.summary, "club summary"),
    address: entry.address || "",
    facilities: (entry.facilities || []).filter((item): item is string => Boolean(item)),
    heroImage: mapImage(entry.heroImage),
  };
}

function mapCategory(value: string | null | undefined): ActivityCategory {
  if (value === "Recover" || value === "Connect") return value;
  return "Move";
}

function mapIntensity(value: string | null | undefined): ActivityIntensity {
  if (value === "Gentle" || value === "High") return value;
  return "Moderate";
}

function mapActivity(entry: ContentfulActivity): Activity {
  const linkedClubs = entry.availableAtCollection?.items || [];
  const slug = required(entry.slug, "activity slug");

  return {
    id: required(entry.sys?.id, "activity id"),
    title: required(entry.title, "activity title"),
    slug,
    summary: required(entry.summary, "activity summary"),
    details: required(entry.details, "activity details"),
    category: mapCategory(entry.category),
    intensity: mapIntensity(entry.intensity),
    durationMinutes: entry.durationMinutes || 45,
    heroImage: mapImage(entry.heroImage),
    clubs: linkedClubs.filter((item): item is ContentfulClub => Boolean(item)).map(mapClub),
  };
}

function getContentfulConfig(): ContentfulConfig | null {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!spaceId || !accessToken) return null;

  return {
    spaceId,
    accessToken,
    environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
  };
}

export function isContentfulConfigured(): boolean {
  return getContentfulConfig() !== null;
}

async function fetchContentfulContent({
  spaceId,
  accessToken,
  environment,
}: ContentfulConfig): Promise<ContentfulResponse> {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environment}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: wellnessQuery }),
    },
  );

  if (!response.ok) {
    throw new Error(`Contentful request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as ContentfulResponse;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload;
}

async function loadContentfulContent(): Promise<WellnessContent> {
  const config = getContentfulConfig();
  if (!config) return sampleContent;

  const payload = await fetchContentfulContent(config);
  const clubs = (payload.data?.clubCollection?.items || [])
    .filter((item): item is ContentfulClub => Boolean(item))
    .map(mapClub);
  const activities = (payload.data?.activityCollection?.items || [])
    .filter((item): item is ContentfulActivity => Boolean(item))
    .map(mapActivity);

  return { activities, clubs };
}

export async function getWellnessContent(): Promise<WellnessContent> {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENTFUL_CACHE_TAG);

  return loadContentfulContent();
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const { activities } = await getWellnessContent();
  return activities.find((activity) => activity.slug === slug) || null;
}

export async function getClubBySlug(slug: string): Promise<ClubWithActivities | null> {
  const { activities, clubs } = await getWellnessContent();
  const club = clubs.find((item) => item.slug === slug);

  if (!club) return null;

  return {
    ...club,
    activities: activities.filter((activity) =>
      activity.clubs.some((activityClub) => activityClub.id === club.id),
    ),
  };
}

export { CONTENTFUL_CACHE_TAG };
