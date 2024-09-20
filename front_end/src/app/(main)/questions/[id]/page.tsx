import { redirect } from "next/navigation";

import PostsApi from "@/services/posts";

type Props = {
  params: { id: number };
};

export default async function IndividualQuestion({ params }: Props) {
  const { id, slug } = await PostsApi.getPost(params.id, false);
  return redirect(`/questions/${id}/${slug}/`);
}
