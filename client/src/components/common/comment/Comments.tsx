import { CommentsProp } from "../../../types";
import AddComment from "./AddComment";
import Comment from "./Comment";

const Comments: React.FC<CommentsProp> = ({ comments }) => {
  return (
    <>
      {comments.map((comment) => {
        return <Comment comment={comment} key={comment.id} />;
      })}
      <div className="divider mt-0 ml-0"></div>
      <AddComment />
    </>
  );
};

export default Comments;
