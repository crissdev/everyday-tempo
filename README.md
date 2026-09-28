# Everyday Tempo

A small Next.js + Contentful project to demo headless CMS integration.
It has two domain objects — activities and clubs.

The app runs with local sample content until Contentful credentials are provided in a `.env` file.

## Run locally

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contentful model

Create the content types with these exact API identifiers. The GraphQL query in
`src/lib/cms/contentful.ts` depends on them.

### `club`

| Field      | API identifier | Type            | Required    |
|------------|----------------|-----------------|-------------|
| Name       | `name`         | Short text      | Yes         |
| Slug       | `slug`         | Short text      | Yes, unique |
| City       | `city`         | Short text      | Yes         |
| Summary    | `summary`      | Long text       | Yes         |
| Hero image | `heroImage`    | Media, one file | No          |

Use `name` as the entry title field.

### `activity`

| Field        | API identifier    | Type                            | Required                             |
|--------------|-------------------|---------------------------------|--------------------------------------|
| Title        | `title`           | Short text                      | Yes                                  |
| Slug         | `slug`            | Short text                      | Yes, unique                          |
| Summary      | `summary`         | Long text                       | Yes                                  |
| Details      | `details`         | Long text                       | Yes                                  |
| Category     | `category`        | Short text                      | Yes; `Move`, `Recover`, or `Connect` |
| Intensity    | `intensity`       | Short text                      | Yes; `Gentle`, `Moderate`, or `High` |
| Duration     | `durationMinutes` | Integer                         | Yes                                  |
| Hero image   | `heroImage`       | Media, one file                 | No                                   |
| Available at | `availableAt`     | References, many `club` entries | No                                   |

Use `title` as the entry title field.

The repository includes four generated activity images under `public/activities`
for the local sample content. Activities loaded from Contentful only use their
Contentful media asset; an activity without one has no hero image.

## Environment variables

```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_DELIVERY_TOKEN=your_delivery_api_token
CONTENTFUL_REVALIDATE_SECRET=a_long_random_value
```

Only server code reads these values. Do not prefix them with `NEXT_PUBLIC_`.

## Publishing flow

1. An editor changes and publishes an activity or club in Contentful.
2. Contentful sends a `POST` webhook to `/api/revalidate`.
3. The webhook includes `x-contentful-webhook-secret` with the same value as
   `CONTENTFUL_REVALIDATE_SECRET`.
4. Next.js invalidates the `contentful-wellness` cache tag and refreshes the
   content on the next request.

The webhook will be useful after the app has a public deployment URL. Locally,
restart the development server after changing environment variables.

## Important files

- `src/lib/cms/contentful.ts` — GraphQL query, response mapping, caching
- `src/lib/cms/types.ts` — app-owned domain types
- `src/lib/cms/sample-content.ts` — explicit development fallback
- `src/app/api/revalidate/route.ts` — authenticated Contentful webhook target
- `src/app/activities/[slug]/page.tsx` — activity detail route
- `src/app/clubs/[slug]/page.tsx` — club detail route

## Verify

```bash
pnpm lint
pnpm exec next typegen
pnpm exec tsc --noEmit
pnpm exec next build --webpack
```

The webpack build command is useful in restricted environments where Turbopack
cannot open its internal worker port.
