import { permanentRedirect } from "next/navigation";

type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export default async function ProjectRedirectPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  permanentRedirect(`/work/${slug}`);
}
