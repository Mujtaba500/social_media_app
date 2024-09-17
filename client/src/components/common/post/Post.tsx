import { Trash2, Pencil, ThumbsUp, MessageCircle } from "lucide-react";
import Comments from "../comment/Comments";
import EditPost from "./EditPost";
import { PostProps } from "../../../types";
import { useAuthContext } from "../../../context/authContext";
import useDeletePost from "../../../hooks/Post/useDeletePost";
import useLikeUnlikePost from "../../../hooks/Post/useLikeUnlikePost";

const Post: React.FC<PostProps> = ({ post }) => {
  const { authUser } = useAuthContext();

  const { deletePost, loading } = useDeletePost();

  const { likeUnlikePost, loading: likeLoading } = useLikeUnlikePost();

  const handleDelete = () => {
    deletePost(post.id);
  };

  return (
    <div>
      <div className="flex justify-between ml-4 ">
        <div className="flex">
          <div className="avatar placeholder">
            {post.author.profilepic ? (
              <img
                src={`${post?.author?.profilepic}`}
                className="w-12 rounded-full"
              />
            ) : (
              <div className="bg-neutral text-neutral-content w-12 rounded-full">
                <span>{post?.author?.fullName.slice(0, 1)}</span>
              </div>
            )}
          </div>
          <div className="ml-2 ">
            <h1 className="text-slate-200 text-lg  font-bold ">
              {post?.author.fullName}
            </h1>
            <p className="text-white">{post.content}</p>
          </div>
        </div>
        {authUser?.id === post.authorId ? (
          <div className="flex">
            <Pencil
              size={20}
              className="cursor-pointer mr-2 hover:text-blue-400"
              onClick={() => {
                const modal = document.getElementById(
                  `editPostModal${post.id}`
                ) as HTMLDialogElement;
                if (modal) {
                  modal.showModal();
                }
              }}
            />
            {loading ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : (
              <Trash2
                size={20}
                className="cursor-pointer mr-4 hover:text-red-600"
                onClick={handleDelete}
              />
            )}
          </div>
        ) : null}
      </div>
      <div className=" mt-4 flex justify-center">
        {post.image ? (
          <img
            className="ml-49 self-center justify-self-center"
            src={`${post.image}`}
            alt="postImg"
          />
        ) : null}
      </div>
      <div className="flex m-4 justify-around">
        <div className="flex">
          {post.likes.includes(authUser!.id) ? (
            <ThumbsUp
              size={20}
              className="cursor-pointer text-blue-600"
              onClick={() => {
                likeUnlikePost(post.id);
              }}
            />
          ) : (
            <ThumbsUp
              size={20}
              className="cursor-pointer hover:text-blue-400"
              onClick={() => {
                likeUnlikePost(post.id);
              }}
            />
          )}

          <p className="ml-1">{post.likes.length}</p>
        </div>
        <div className="flex">
          <MessageCircle
            size={20}
            onClick={() => {
              const modal = document.getElementById(
                `commentModal${post.id}`
              ) as HTMLDialogElement;
              if (modal) {
                modal.showModal();
              }
            }}
            className="cursor-pointer hover:text-green-400"
          />
          <p className="ml-1">{post.comments.length}</p>
        </div>
      </div>
      <dialog id={`commentModal${post.id}`} className="modal">
        <div className="modal-box">
          <h1 className="font-bold text-lg text-white">COMMENTS</h1>
          <Comments comments={post.comments} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <EditPost postId={post.id} />
      <div className="divider mt-0 ml-0"></div>
    </div>
  );
};

export default Post;
