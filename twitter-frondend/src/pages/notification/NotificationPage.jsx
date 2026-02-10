import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NotificationPage = () => {
    const queryClient = useQueryClient();

    // 1. FETCH NOTIFICATIONS
    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"], // Fixed spelling: "notifications" vs "nodifications"
        queryFn: async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nodifications`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw error;
            }
        }
    });

    // 2. DELETE NOTIFICATIONS
    const { mutate: deleteNotificationsMutate } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nodifications`, {
                    method: "DELETE",
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Notifications deleted");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleDeleteAll = () => {
        if (window.confirm("Are you sure you want to delete all notifications?")) {
            deleteNotificationsMutate();
        }
    };

    return (
        <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
            <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                <p className='font-bold'>Notifications</p>
                <div className='dropdown dropdown-end'> {/* Added dropdown-end for better UI */}
                    <div tabIndex={0} role='button' className='m-1'>
                        <IoSettingsOutline className='w-4 cursor-pointer' />
                    </div>
                    <ul
                        tabIndex={0}
                        className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-gray-700'
                    >
                        <li>
                            <a onClick={handleDeleteAll}>Delete all notifications</a>
                        </li>
                    </ul>
                </div>
            </div>

            {isLoading && (
                <div className='flex justify-center h-full items-center mt-10'>
                    <LoadingSpinner size='lg' />
                </div>
            )}

            {/* Safety check for empty notifications */}
            {!isLoading && notifications?.length === 0 && (
                <div className='text-center p-4 font-bold'>No notifications 🤔</div>
            )}

            {notifications?.map((notification) => (
                <div className='border-b border-gray-700' key={notification._id}>
                    <div className='flex gap-2 p-4'>
                        {notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
                        {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
                        
                        {/* Ensure notification.from exists before rendering */}
                        {notification.from && (
                            <Link to={`/profile/${notification.from.username}`} className="flex gap-2">
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                        <img 
                                            src={notification.from.profileImg || "/avatar-placeholder.png"} 
                                            alt="avatar" 
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex gap-1'>
                                        <span className='font-bold'>@{notification.from.username}</span>
                                        <span>{notification.type === "follow" ? "followed you" : "liked your post"}</span>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationPage;