import { permanentRedirect } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default function ProjectRedirectPage({ params }: Props) {
  permanentRedirect(`/work/${params.slug}`);
}
