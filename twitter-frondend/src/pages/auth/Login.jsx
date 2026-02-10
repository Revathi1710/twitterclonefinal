import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import XSvg from "../../components/svgs/x";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

const queryClient =useQueryClient();
  const { mutate: login, isPending, isError, error } = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: data.username,
            password: data.password,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      return result;
    },

    onSuccess: () => {
      toast.success("Login successful");
      //refetch the authuser
      queryClient.invalidateQueries({
        queryKey:["authUser"]
        
      })
       
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">
            {"Let's"} go.
          </h1>

          <label className="input input-bordered rounded flex items-center gap-2">
              <FaUser /> 
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>

          <button
            className="btn rounded-full btn-primary text-white"
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner/> : "Login"}
          </button>

          {isError && (
            <p className="text-red-500 text-sm">{error.message}</p>
          )}
        </form>

        <div className="flex flex-col lg:w-2/3 mx-auto gap-2 mt-4">
          <p className="text-white text-lg">
            {"Don't"} have an account?
          </p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
