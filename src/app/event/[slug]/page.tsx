import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug, EVENTS } from "@/lib/mock/events";
import { EventHero } from "@/components/event-hero";
import { EventSchedule } from "@/components/event-schedule";
import { EventHosts, EventSpeakers } from "@/components/event-people";
import { VenueMap } from "@/components/venue-map";
import { StatsStrip } from "@/components/stats-strip";
import { ClaimPanel } from "@/components/claim-panel";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.tagline,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <EventHero event={event} />

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main column */}
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl font-semibold">About</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {event.description}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold">Schedule</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {event.timezone.replace("_", " ")}
              </p>
              <div className="mt-5">
                <EventSchedule event={event} />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold">Speakers</h2>
              <div className="mt-4">
                <EventSpeakers event={event} />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold">Venue</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Claims are geofenced to this location.
              </p>
              <div className="mt-4">
                <VenueMap venue={event.venue} />
              </div>
            </section>
          </div>

          {/* Sticky claim rail */}
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <ClaimPanel event={event} />
            <StatsStrip event={event} />
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold">Hosts</h3>
              <div className="mt-4">
                <EventHosts event={event} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
