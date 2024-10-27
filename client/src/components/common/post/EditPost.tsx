import { useRef } from "react";
import { ImageUp } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useEditPost from "../../../hooks/Post/useEditPost";
import { EditPostProps } from "../../../types";

const EditPost: React.FC<EditPostProps> = ({ postId}) => {
  const imgRef = useRef<HTMLInputElement>(null);

  const { loading, editPost } = useEditPost();

  const formik = useFormik({
    initialValues: {
      content: "",
      image: null,
    },
    validationSchema: Yup.object().shape({
      content: Yup.string()
        .required()
        .min(3, "Post length must be atleast 3 characters long")
        .max(20, "Post length cannot exceed 20 characters"),
      image: Yup.mixed()
        .nullable()
        .notRequired()
        .optional()
        .test("fileType", "Unsupported file format", (value) => {
          if (value) {
            const file = value as File; // Cast to File type
            return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
          }
          return true;
        })
        .test("fileSize", "File size is too large", (value) => {
          if (value) {
            const file = value as File; // Cast to File type
            return file.size <= 5 * 1024 * 1024; // 5MB limit
          }
          return true;
        }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("content", values.content);
      if (values.image) {
        formData.append("postImg", values.image as Blob);
      }
      await editPost(postId, formData);
      formik.values.content = "";

      //Close modal on update
      const modal = document.getElementById(
        `editPostModal${postId}`
      ) as HTMLDialogElement;
      modal.close();
    },
  });

  return (
    <>
      <dialog id={`editPostModal${postId}`} className="modal">
        <div className="modal-box">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex items-center">
              <textarea
                className="textarea textarea-bordered textarea-lg w-full m-0"
                placeholder="Edit Post"
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
              ></textarea>
              {formik.touched.content && formik.errors.content ? (
                <p className="text-red-600 italic text-s ml-2">
                  {formik.errors.content}
                </p>
              ) : null}
              <button
                className="btn btn-primary btn-sm rounded-full py-0 px-6 ml-4 mr-0 text-white "
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
              <ImageUp
                size={32}
                className="ml-3 cursor-pointer"
                onClick={() => imgRef?.current?.click()}
              />
              <input
                type="file"
                id="myFile"
                name="image"
                className="hidden"
                accept="image/*"
                ref={imgRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  formik.setFieldValue("image", file);
                }}
              />
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditPost;
