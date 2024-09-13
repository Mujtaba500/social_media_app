import { ImageUp } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreatePost = () => {
  const formik = useFormik({
    initialValues: {
      post: "",
    },
    validationSchema: Yup.object({
      post: Yup.string()
        .min(3, "Post length must be atleast 3 characters long")
        .max(20, "Post length cannot exceed 20 characters"),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          className="textarea textarea-bordered textarea-lg w-full h-1/6 m-0"
          placeholder="What's on your mind?"
          name="post"
          value={formik.values.post}
          onChange={formik.handleChange}
        ></textarea>
        {formik.touched.post && formik.errors.post ? (
          <p className="text-red-600 italic text-s ml-2">
            {formik.errors.post}
          </p>
        ) : null}
        <div className="flex justify-between items-center my-1">
          <ImageUp size={32} className="ml-3 cursor-pointer" />
          <input type="file" id="myFile" name="filename" className="" />
          <button
            type="submit"
            className="btn btn-primary btn-sm rounded-full py-0 px-6 text-white mr-3"
          >
            Post
          </button>
        </div>
        <div className="divider mt-0"></div>
      </form>
    </>
  );
};

export default CreatePost;
