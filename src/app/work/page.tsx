import WorkGallery from "@/components/work/work-gallery";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const projects = await getProjects({ publishedOnly: true });

  return <WorkGallery projects={projects} />;
}
