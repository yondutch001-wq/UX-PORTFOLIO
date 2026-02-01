"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  className?: string;
  children: ReactNode;
};

export default function CoverPanel({ project, className, children }: Props) {
  const imageUrl = useMemo(
    () => project.coverImageUrl?.trim() || "",
    [project.coverImageUrl]
  );
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(imageUrl) && !imageError;
  const fallbackStyle = {
    background: project.cover.background,
    color: project.cover.foreground
  } as const;

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={hasImage ? undefined : fallbackStyle}
    >
      {hasImage ? (
        <>
          <img
            src={imageUrl}
            alt={`${project.title} cover`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/35 to-slate-900/80" />
        </>
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
