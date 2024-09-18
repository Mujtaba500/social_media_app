import { useFormik } from "formik";
import useEditComment from "../../../hooks/comment/useEditComment";
import { EditCommentProps } from "../../../types";
import * as Yup from "yup";

const EditComment: React.FC<EditCommentProps> = ({ postId, commentId }) => {
  const { editComment, loading } = useEditComment();

  const formik = useFormik({
    initialValues: {
      body: "",
    },
    validationSchema: Yup.object({
      body: Yup.string()
        .required()
        .max(100, "Comment length cannot exceed 100 characters"),
    }),
    onSubmit: async (values) => {
      await editComment(postId, commentId, values.body);
      formik.values.body = "";
      //
      //Close modal on update
      const modal = document.getElementById(
        `editCommentModal${commentId}`
      ) as HTMLDialogElement;
      modal.close();
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex items-center">
          <textarea
            className="textarea textarea-bordered textarea-lg w-full m-0"
            placeholder="Update comment"
            name="body"
            value={formik.values.body}
            onChange={formik.handleChange}
          ></textarea>
          <button
            type="submit"
            className="btn btn-primary btn-sm rounded-full py-0 px-6 ml-4 mr-0 text-white "
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditComment;
