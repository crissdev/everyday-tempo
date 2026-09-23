import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { CONTENTFUL_CACHE_TAG } from "@/lib/cms/contentful";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.CONTENTFUL_REVALIDATE_SECRET;
  const providedSecret = request.headers.get("x-contentful-webhook-secret");

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidateTag(CONTENTFUL_CACHE_TAG, "max");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
