import type { WellnessContent } from "./types";

const clubs: WellnessContent["clubs"] = [
  {
    id: "club-angel",
    name: "Angel",
    slug: "angel",
    city: "London",
    summary: "A bright, social club built for training, recovery and a proper reset.",
    address: "Islington, London",
    facilities: ["Pool", "Reformer studio", "Sauna", "Café"],
  },
  {
    id: "club-notting-hill",
    name: "Notting Hill",
    slug: "notting-hill",
    city: "London",
    summary: "A neighbourhood club with focused studios and room to wind down.",
    address: "Notting Hill, London",
    facilities: ["Cycle studio", "Steam room", "Gym floor", "Club lounge"],
  },
  {
    id: "club-manchester",
    name: "Manchester",
    slug: "manchester",
    city: "Manchester",
    summary: "Big energy, expert coaching and recovery spaces under one roof.",
    address: "Central Manchester",
    facilities: ["Pool", "Boxing studio", "Spa", "Work space"],
  },
];

export const sampleContent: WellnessContent = {
  clubs,
  activities: [
    {
      id: "activity-reformer",
      title: "Reformer Pilates",
      slug: "reformer-pilates",
      summary: "Controlled movement that builds strength where it counts.",
      details:
        "A full-body session using springs, straps and a moving carriage. Your coach guides every sequence, so you can focus on control, alignment and steady progress.",
      category: "Move",
      intensity: "Moderate",
      durationMinutes: 50,
      heroImage: {
        url: "/activities/reformer-pilates.png",
        alt: "A member practising reformer Pilates in a warm, modern studio",
      },
      clubs: [clubs[0], clubs[1]],
    },
    {
      id: "activity-cycle-power",
      title: "Cycle Power",
      slug: "cycle-power",
      summary: "Ride to the beat, build momentum and leave the day behind.",
      details:
        "A coached indoor ride that blends climbing efforts, quick intervals and recovery. Set the resistance to suit you and let the room's energy carry you through.",
      category: "Move",
      intensity: "High",
      durationMinutes: 45,
      heroImage: {
        url: "/activities/cycle-power.png",
        alt: "A group taking part in an energetic indoor cycle class",
      },
      clubs: [clubs[1], clubs[2]],
    },
    {
      id: "activity-restore-reset",
      title: "Restore & Reset",
      slug: "restore-reset",
      summary: "Gentle mobility and breathwork for a quieter headspace.",
      details:
        "Slow down with guided mobility, longer stretches and calm breathing. It is a low-pressure session designed to leave you moving more freely.",
      category: "Recover",
      intensity: "Gentle",
      durationMinutes: 45,
      heroImage: {
        url: "/activities/restore-reset.png",
        alt: "Two members practising gentle mobility in a quiet wellness studio",
      },
      clubs: [clubs[0]],
    },
    {
      id: "activity-social-padel",
      title: "Social Padel",
      slug: "social-padel",
      summary: "Friendly doubles, quick rallies and no pressure to be a pro.",
      details:
        "A relaxed doubles session for members who want to move and meet people. Learn the basics, rotate partners and stay for a coffee afterwards.",
      category: "Connect",
      intensity: "Moderate",
      durationMinutes: 60,
      heroImage: {
        url: "/activities/social-padel.png",
        alt: "Four members enjoying a doubles padel session",
      },
      clubs: [clubs[0], clubs[2]],
    },
  ],
};
