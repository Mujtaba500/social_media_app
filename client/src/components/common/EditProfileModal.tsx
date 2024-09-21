import { ImageUp } from "lucide-react";
import { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useEditProfile from "../../hooks/user/useEditProfile";
import { EditProfileProps } from "../../types";
import { useAuthContext } from "../../context/authContext";
import { useNavigateNoUpdates } from "../../context/RouterUtils";

const EditProfileModal: React.FC<EditProfileProps> = ({ setUserProfile }) => {
  const profileImgRef = useRef<HTMLInputElement>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);

  const { editprofile, loading } = useEditProfile();

  const { setAuthUser } = useAuthContext();

  const navigate = useNavigateNoUpdates();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      currentPassword: "",
      newPassword: "",
      profileImg: null,
      coverPhoto: null,
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string()
        .min(6, "Full Name length must be atleast 6 characters long")
        .max(20, "Full Name length cannot exceed 20 characters"),
      username: Yup.string()
        .min(6, "username must be atleast 6 characters long")
        .max(20, "username cannot exceed 20 characters")
        .matches(
          /^[0-9a-z]*$/,
          "Username can only contain alphanumeric characters"
        ),
      currentPassword: Yup.string()
        .min(6, "Password must be 6 characters long")
        .max(30, "Password must not exceed 30 characters")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .test(
          "currentPasswordRequired",
          "Current password is required when new password is provided",
          function (value) {
            const { newPassword } = this.parent;
            return newPassword ? Boolean(value) : true; // if newPassword exists, currentPassword is required
          }
        ),
      newPassword: Yup.string()
        .min(6, "Password must be 6 characters long")
        .max(30, "Password must not exceed 30 characters")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .test(
          "newPasswordRequired",
          "New password is required when current password is provided",
          function (value) {
            const { currentPassword } = this.parent;
            return currentPassword ? Boolean(value) : true; // if currentPassword exists, newPassword is required
          }
        ),
      profileImg: Yup.mixed()
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
      coverPhoto: Yup.mixed()
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
      values.fullName && formData.append("fullName", values.fullName);
      values.username && formData.append("username", values.username);
      if (values.currentPassword && values.newPassword) {
        formData.append("currentPassword", values.currentPassword);
        formData.append("newPassword", values.newPassword);
      }
      if (values.profileImg) {
        formData.append("profilepic", values.profileImg as File);
      }
      if (values.coverPhoto) {
        formData.append("coverphoto", values.coverPhoto as File);
      }

      const updatedUser = await editprofile(formData);
      setUserProfile(updatedUser);
      setAuthUser(updatedUser);

      if (values.username) {
        navigate(`/profile/${values.username}`);
      }

      formik.resetForm();
      //Close modal on update
      const modal = document.getElementById(
        `editProfileModal`
      ) as HTMLDialogElement;
      modal.close();
    },
  });

  return (
    <>
      <dialog id="editProfileModal" className="modal">
        <div className="modal-box">
          <form onSubmit={formik.handleSubmit}>
            <h1 className="font-bold text-lg text-white">Update Profile</h1>
            <div className="flex gap-4 mt-3">
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                className="input input-bordered w-full max-w-xs "
                value={formik.values.fullName}
                onChange={formik.handleChange}
              />
              <input
                type="text"
                placeholder="User Name"
                name="username"
                className="input input-bordered w-full max-w-xs "
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Current Password"
                className="input input-bordered w-full max-w-xs my-4"
                name="currentPassword"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
              />
              <input
                type="text"
                placeholder="New Password"
                className="input input-bordered w-full max-w-xs my-4"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex ">
              <div className=" w-1/2">
                <h1>Update Profile Picture</h1>
                <ImageUp
                  size={32}
                  className="ml-3 cursor-pointer mt-2  "
                  onClick={() => profileImgRef?.current?.click()}
                />
                <input
                  type="file"
                  id="myFile"
                  className=""
                  hidden
                  name="profileImg"
                  ref={profileImgRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    formik.setFieldValue("profileImg", file);
                  }}
                />
              </div>
              <div>
                <h1>Update Cover Photo</h1>
                <ImageUp
                  size={32}
                  className="ml-3 cursor-pointer mt-2"
                  onClick={() => coverPhotoRef?.current?.click()}
                />
                <input
                  type="file"
                  id="myFile"
                  className=""
                  hidden
                  name="coverPhoto"
                  ref={coverPhotoRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    formik.setFieldValue("coverPhoto", file);
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-4 rounded-full btn-sm  text-white w-full"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
