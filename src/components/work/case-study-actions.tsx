"use client";

import { useMemo } from "react";
import Link from "next/link";
import { trackEngagement } from "@/lib/engagement";

type Props = {
  projectSlug: string;
  projectId?: string | null;
};

export default function CaseStudyActions({ projectSlug, projectId }: Props) {
  const contactHref = useMemo(
    () => `/contact?project=${encodeURIComponent(projectSlug)}`,
    [projectSlug]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={contactHref}
        className="btn btn-primary"
        onClick={() =>
          trackEngagement({ projectSlug, projectId, eventType: "inquiry" })
        }
      >
        Start a project inquiry
      </Link>
    </div>
  );
}
