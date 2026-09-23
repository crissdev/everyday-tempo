import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityCard } from "@/components/activity-card";
import { getClubBySlug, getWellnessContent } from "@/lib/cms/contentful";

export async function generateStaticParams() {
  const { clubs } = await getWellnessContent();
  return clubs.map((club) => ({ slug: club.slug }));
}

export default async function ClubPage(props: PageProps<"/clubs/[slug]">) {
  const { slug } = await props.params;
  const club = await getClubBySlug(slug);

  if (!club) notFound();

  return (
    <main className="detail-shell">
      <Link href="/#clubs" className="back-link">
        ← All clubs
      </Link>
      <section className="detail-hero club-detail-hero">
        <div>
          <span className="eyebrow">{club.city}</span>
          <h1>{club.name}</h1>
          <p className="detail-lede">{club.summary}</p>
        </div>
        <div className="address-card">
          <span className="eyebrow">Find us</span>
          <strong>{club.address || club.city}</strong>
        </div>
      </section>

      {club.facilities.length ? (
        <section className="facility-strip" aria-label="Club facilities">
          {club.facilities.map((facility) => (
            <span key={facility}>{facility}</span>
          ))}
        </section>
      ) : null}

      <section className="detail-activities">
        <div className="section-heading">
          <div>
            <span className="eyebrow">On at this club</span>
            <h2>Try something new</h2>
          </div>
        </div>
        {club.activities.length ? (
          <div className="activity-grid">
            {club.activities.map((activity, index) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        ) : (
          <p className="muted">Activities for this club are coming soon.</p>
        )}
      </section>
    </main>
  );
}
