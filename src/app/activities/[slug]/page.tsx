import Link from "next/link";
import { notFound } from "next/navigation";

import { getActivityBySlug, getWellnessContent } from "@/lib/cms/contentful";

export async function generateStaticParams() {
  const { activities } = await getWellnessContent();
  return activities.map((activity) => ({ slug: activity.slug }));
}

export default async function ActivityPage(props: PageProps<"/activities/[slug]">) {
  const { slug } = await props.params;
  const activity = await getActivityBySlug(slug);

  if (!activity) notFound();

  return (
    <main className="detail-shell">
      <Link href="/#activities" className="back-link">
        ← All activities
      </Link>
      <section className="detail-hero">
        <div>
          <span className="eyebrow">{activity.category}</span>
          <h1>{activity.title}</h1>
          <p className="detail-lede">{activity.summary}</p>
        </div>
        <dl className="fact-grid">
          <div>
            <dt>Intensity</dt>
            <dd>{activity.intensity}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{activity.durationMinutes} min</dd>
          </div>
        </dl>
      </section>

      <section className="detail-body">
        <div>
          <span className="eyebrow">What to expect</span>
          <p>{activity.details}</p>
        </div>
        <aside>
          <span className="eyebrow">Available at</span>
          {activity.clubs.length ? (
            <div className="linked-list">
              {activity.clubs.map((club) => (
                <Link key={club.id} href={`/clubs/${club.slug}`}>
                  <span>
                    <strong>{club.name}</strong>
                    <small>{club.city}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted">Club availability is coming soon.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
