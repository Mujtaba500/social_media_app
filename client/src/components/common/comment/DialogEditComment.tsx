import EditComment from "./EditComment";

const DialogEditComment = () => {
  return (
    <dialog id="editCommentModal" className="modal">
      <div className="modal-box">
        <EditComment />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default DialogEditComment;
