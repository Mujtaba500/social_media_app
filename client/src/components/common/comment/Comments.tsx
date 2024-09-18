import { CommentsProp } from "../../../types";
import AddComment from "./AddComment";
import Comment from "./Comment";

const Comments: React.FC<CommentsProp> = ({ comments, postId }) => {
  return (
    <>
      {comments.map((comment) => {
        return <Comment comment={comment} postId={postId} key={comment.id} />;
      })}
      <div className="divider mt-0 ml-0"></div>
      <AddComment postId={postId} />
    </>
  );
};

export default Comments;
