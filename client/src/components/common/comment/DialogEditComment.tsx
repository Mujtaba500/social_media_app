import { EditCommentProps } from "../../../types";
import EditComment from "./EditComment";

const DialogEditComment: React.FC<EditCommentProps> = ({
  postId,
  commentId,
}) => {
  return (
    <dialog id={`editCommentModal${commentId}`} className="modal">
      <div className="modal-box">
        <EditComment postId={postId} commentId={commentId} />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default DialogEditComment;
