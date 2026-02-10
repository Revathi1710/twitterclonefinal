import { FaRegComment, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");

	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({
		queryKey: ["authUser"],
		enabled: false, // Prevents the component from trying to fetch if data is missing
	});

	if (!authUser) return null;

	/* ---------------- DELETE POST ---------------- */
	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/api/post/${post._id}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Delete failed");
			return data;
		},
		onSuccess: () => {
			toast.success("Post deleted");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	/* ---------------- LIKE POST ---------------- */
	/* ---------------- LIKE POST ---------------- */
const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/post/like/${post._id}`,
            {
                method: "POST",
                credentials: "include",
            }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Like failed");
        return data; 
    },
    onSuccess: () => {
        // This is the "Magic" line. 
        // It tells React Query to refetch any query that contains "posts" in its key
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        
        // If you are on the profile page, you might need to invalidate that too:
        queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => {
        toast.error(error.message);
    },
});

	/* ---------------- COMMENT POST ---------------- */
	const { mutate: postComment, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/api/post/command/${post._id}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ text: comment }),
				}
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Comment failed");
			return data;
		},
		onSuccess: () => {
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	/* ---------------- HELPERS ---------------- */
	const isLiked = post.likes.includes(authUser._id);
	const isMyPost = authUser._id === post.user._id;
	const formattedDate = formatPostDate(post.createdAt);

	const handleDeletePost = () => deletePost();
	const handleLikePost = () => !isLiking && likePost();

	const handlePostComment = (e) => {
		e.preventDefault();
		if (!comment.trim()) return;
		postComment();
	};

	const postOwner = post.user;

	return (
		<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
			{/* Avatar */}
			<div className='avatar'>
				<Link
					to={`/profile/${postOwner.userName}`}
					className='w-8 rounded-full overflow-hidden'
				>
					<img
						src={postOwner.profileImg || "/avatar-placeholder.png"}
						alt='profile'
					/>
				</Link>
			</div>

			{/* Content */}
			<div className='flex flex-col flex-1'>
				{/* Header */}
				<div className='flex gap-2 items-center'>
					<Link to={`/profile/${postOwner.userName}`} className='font-bold'>
						{postOwner.fullName}
					</Link>
					<span className='text-gray-700 flex gap-1 text-sm'>
						<Link to={`/profile/${postOwner.userName}`}>
							@{postOwner.userName}
						</Link>
						<span>·</span>
						<span>{formattedDate}</span>
					</span>

					{isMyPost && (
						<span className='flex justify-end flex-1'>
							{isDeleting ? (
								<LoadingSpinner size='small' />
							) : (
								<FaTrash
									className='cursor-pointer hover:text-red-500'
									onClick={handleDeletePost}
								/>
							)}
						</span>
					)}
				</div>

				{/* Post body */}
				<div className='flex flex-col gap-3 mt-2'>
					<span>{post.text}</span>
					{post.img && (
						<img
							src={post.img}
							className='h-80 object-contain rounded-lg border border-gray-700'
							alt='post'
						/>
					)}
				</div>

				{/* Actions */}
				<div className='flex justify-between mt-3'>
					<div className='flex gap-4 items-center w-2/3 justify-between'>
						{/* Comments */}
						<div
							className='flex gap-1 items-center cursor-pointer group'
							onClick={() =>
								document
									.getElementById(`comments_modal${post._id}`)
									.showModal()
							}
						>
							<FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
							<span className='text-sm text-slate-500 group-hover:text-sky-400'>
								{post.comments.length}
							</span>
						</div>

						{/* Modal */}
						<dialog
							id={`comments_modal${post._id}`}
							className='modal border-none outline-none'
						>
							<div className='modal-box rounded border border-gray-600'>
								<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>

								<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
									{post.comments.length === 0 && (
										<p className='text-sm text-slate-500'>
											No comments yet 🤔
										</p>
									)}

									{post.comments.map((c) => (
										<div key={c._id} className='flex gap-2'>
											<img
												src={c.user.profileImg || "/avatar-placeholder.png"}
												className='w-8 h-8 rounded-full'
											/>
											<div>
												<div className='text-sm font-bold'>
													{c.user.fullName}
													<span className='text-gray-500 ml-1'>
														@{c.user.username}
													</span>
												</div>
												<p className='text-sm'>{c.text}</p>
											</div>
										</div>
									))}
								</div>

								<form
									onSubmit={handlePostComment}
									className='flex gap-2 mt-4'
								>
									<textarea
										className='textarea w-full resize-none'
										placeholder='Add a comment...'
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
									<button className='btn btn-primary btn-sm'>
										{isCommenting ? (
											<LoadingSpinner size='small' />
										) : (
											"Post"
										)}
									</button>
								</form>
							</div>

							<form method='dialog' className='modal-backdrop'>
								<button>close</button>
							</form>
						</dialog>

						{/* Repost */}
						<div className='flex gap-1 items-center text-slate-500'>
							<BiRepost className='w-6 h-6' />
							<span className='text-sm'>0</span>
						</div>

						{/* Like */}
						<div
							className='flex gap-1 items-center cursor-pointer'
							onClick={handleLikePost}
						>
							{isLiking ? (
								<LoadingSpinner size='small' />
							) : isLiked ? (
								<FaHeart className='text-pink-500' />
							) : (
								<FaRegHeart className='text-slate-500 hover:text-pink-500' />
							)}
							<span
								className={`text-sm ${
									isLiked ? "text-pink-500" : "text-slate-500"
								}`}
							>
								{post.likes.length}
							</span>
						</div>
					</div>

					{/* Bookmark */}
					<div className='flex w-1/3 justify-end'>
						<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
