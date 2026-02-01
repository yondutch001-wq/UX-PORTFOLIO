"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  className?: string;
};

export default function CoverImage({ project, className }: Props) {
  const imageUrl = useMemo(
    () => project.coverImageUrl?.trim() || "",
    [project.coverImageUrl]
  );
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(imageUrl) && !imageError;
  const fallbackStyle = {
    background: project.cover.background
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
        <img
          src={imageUrl}
          alt={`${project.title} cover`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : null}
    </div>
  );
}
