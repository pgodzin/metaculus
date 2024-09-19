import { PostWithForecasts } from "@/types/post";
import { deserializeMinifiedAggregations } from "@/utils/forecasts";

/**
 * Deserializing posts with minified forecasts
 */
export function deserializePost(post: PostWithForecasts) {
  if (post.question) {
    post.question.aggregations = deserializeMinifiedAggregations(
      post.question.aggregations
    );
  }
  if (post.group_of_questions) {
    post.group_of_questions.questions.map((obj) => {
      obj.aggregations = deserializeMinifiedAggregations(obj.aggregations);
      return obj;
    });
  }
  if (post.conditional) {
    post.conditional.question_yes.aggregations =
      deserializeMinifiedAggregations(
        post.conditional.question_yes.aggregations
      );
    post.conditional.question_no.aggregations = deserializeMinifiedAggregations(
      post.conditional.question_no.aggregations
    );
  }

  return post;
}
