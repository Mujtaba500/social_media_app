import { ImageUp } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRef } from "react";
import useCreatePost from "../../../hooks/Post/useCreatePost";

const CreatePost = () => {
  const imgRef = useRef<HTMLInputElement>(null);
  const { createPost, loading } = useCreatePost();

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
        formData.append("postImg", values.image! as File);
      }
      await createPost(formData);
      formik.values.content = "";
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          className="textarea textarea-bordered textarea-lg w-full h-1/6 m-0"
          placeholder="What's on your mind?"
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
        ></textarea>
        {formik.touched.content && formik.errors.content ? (
          <p className="text-red-600 italic text-s ml-2">
            {formik.errors.content}
          </p>
        ) : null}
        <div className="flex justify-between items-center my-1">
          <ImageUp
            size={32}
            className="ml-3 cursor-pointer"
            onClick={() => imgRef?.current?.click()}
          />
          <input
            type="file"
            id="myFile"
            accept="image/*"
            hidden
            name="image"
            ref={imgRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files ? e.target.files[0] : null;
              formik.setFieldValue("image", file);
            }}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm rounded-full py-0 px-6 text-white mr-3"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
        <div className="divider mt-0"></div>
      </form>
    </>
  );
};

export default CreatePost;
