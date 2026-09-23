import Link from "next/link";

import { ActivityCard } from "@/components/activity-card";
import { getWellnessContent, isContentfulConfigured } from "@/lib/cms/contentful";

export default async function Home() {
  const { activities, clubs } = await getWellnessContent();
  const usesContentful = isContentfulConfigured();

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Move · Recover · Connect</span>
          <h1>What do you need today?</h1>
          <p>
            Find an activity that fits your energy, then discover where you can
            try it.
          </p>
          <a className="primary-link" href="#activities">
            Explore activities <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span className="orbit-copy">YOUR TEMPO</span>
          <span className="orbit-dot orbit-dot-one" />
          <span className="orbit-dot orbit-dot-two" />
        </div>
      </section>

      <section id="activities" className="section-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Activity library</span>
            <h2>Choose your kind of good</h2>
          </div>
          <span className="content-source">
            {usesContentful ? "Live from Contentful" : "Local sample content"}
          </span>
        </div>
        <div className="activity-grid">
          {activities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </section>

      <section id="clubs" className="section-shell club-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Places to belong</span>
            <h2>Find your club</h2>
          </div>
        </div>
        <div className="club-list">
          {clubs.map((club) => (
            <Link key={club.id} href={`/clubs/${club.slug}`} className="club-row">
              <span>
                <strong>{club.name}</strong>
                <small>{club.city}</small>
              </span>
              <span className="club-facilities">
                {club.facilities.slice(0, 3).join(" · ")}
              </span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
