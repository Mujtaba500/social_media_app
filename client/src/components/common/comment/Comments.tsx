import AddComment from "./AddComment";
import Comment from "./Comment";

const Comments = () => {
  return (
    <>
      <Comment />
      <Comment />
      <div className="divider mt-0 ml-0"></div>
      <AddComment />
    </>
  );
};

export default Comments;
