import type { Comment } from "../../redux/comments/types";

type Props = {
  comment: Comment;
};

const CommentCard = ({ comment }: Props) => {
  return (
    <div className="text-grayscale-700 bg-white border border-[#EEEEEE] rounded-2xl p-4 hover:shadow-sm transition">
      <div className="text-xs text-light-txt mb-3">
        {new Date(comment.created_at).toLocaleDateString("uk-UA")}
      </div>

      <p className="text-grayscale-900 leading-6">
        {comment.anonymous_comment}
      </p>
    </div>
  );
};

export default CommentCard;
