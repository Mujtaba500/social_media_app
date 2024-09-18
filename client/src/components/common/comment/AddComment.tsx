import { useFormik } from "formik";
import * as Yup from "yup";
import useCreateComment from "../../../hooks/comment/useCreateComment";
import { AddCommentsProps } from "../../../types";

const AddComment: React.FC<AddCommentsProps> = ({ postId }) => {
  const { createComment, loading } = useCreateComment();

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
      await createComment(values.body, postId);
      formik.values.body = "";
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex items-center">
          <textarea
            className="textarea textarea-bordered textarea-lg w-full m-0"
            placeholder="Add comment"
            name="body"
            value={formik.values.body}
            onChange={formik.handleChange}
          ></textarea>
          {formik.touched.body && formik.errors.body ? (
            <p className="text-red-600 italic text-s ml-2">
              {formik.errors.body}
            </p>
          ) : null}
          <button
            type="submit"
            className="btn btn-primary btn-sm rounded-full py-0 px-6 ml-4 mr-0 text-white "
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddComment;
