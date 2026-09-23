import Link from "next/link";

import type { Activity } from "@/lib/cms/types";

const accentClasses = ["accent-red", "accent-coral", "accent-violet", "accent-cyan"];

export function ActivityCard({
  activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {
  const imageStyle = activity.heroImage
    ? {
        backgroundImage: `linear-gradient(180deg, transparent 25%, rgba(13, 13, 16, 0.88) 100%), url(${JSON.stringify(activity.heroImage.url)})`,
      }
    : undefined;

  return (
    <Link
      href={`/activities/${activity.slug}`}
      className={`activity-card ${accentClasses[index % accentClasses.length]}`}
    >
      <div
        className="activity-art"
        style={imageStyle}
        role={activity.heroImage ? "img" : undefined}
        aria-label={activity.heroImage?.alt || undefined}
      >
        <span className="category-chip">{activity.category}</span>
        <span className="activity-number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="activity-card-copy">
        <div className="activity-meta">
          <span>{activity.intensity}</span>
          <span>{activity.durationMinutes} min</span>
        </div>
        <h3>{activity.title}</h3>
        <p>{activity.summary}</p>
        <span className="text-link">See activity ↗</span>
      </div>
    </Link>
  );
}
