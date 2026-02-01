"use client";

import { useEffect, useRef } from "react";
import { trackEngagement } from "@/lib/engagement";
import type { EngagementEvent } from "@/lib/engagement";

type Props = {
  projectSlug: string;
  projectId?: string | null;
  eventType?: EngagementEvent;
};

export default function EngagementTracker({
  projectSlug,
  projectId,
  eventType = "view"
}: Props) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!projectSlug || sentRef.current) return;
    sentRef.current = true;

    trackEngagement({ projectSlug, projectId, eventType });
  }, [eventType, projectId, projectSlug]);

  return null;
}
