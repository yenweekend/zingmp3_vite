import { useState, useCallback } from "react";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../apis/mongoose-api/auth.api";
import setAuthToken from "../services/setAuthToken";
import { setAccount } from "../redux/auth/slice";
import { useForm } from "react-hook-form";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAuthToken(response.data.accessToken);
      localStorage.setItem("auth-token", response.data.accessToken);
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isLogin: true,
          username: response.data.user.username,
        })
      );
      dispatch(
        setAccount({
          isLogin: true,
          username: response.data.user.username,
        })
      );

      navigate("/");
    },
    onError: (error) => {
      setError("loginError", {
        type: "manual",
        message: error.response.data.message,
      });
    },
  });
  const onSubmit = async (data) => {
    mutation.mutate(data);
  };
  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_0_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="md:max-w-md w-full px-4 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-12">
                <h3 className="text-gray-800 text-3xl font-bold">Đăng nhập</h3>
                <p className="text-sm mt-4 text-gray-800">
                  Bạn chưa có tài khoản{" "}
                  <Link
                    to={"/auth/register"}
                    className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >
                    Đăng ký ở đây
                  </Link>
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-xs block mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("username", {
                      required: {
                        value: true,
                        message: "Vui lòng điền tên đăng nhập!",
                      },
                    })}
                    type="text"
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none "
                    onChange={() => {
                      if (errors.loginError) {
                        clearErrors("loginError");
                      }
                    }}
                    placeholder="Điền tên đăng nhập"
                    autoComplete="off"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-2"
                    viewBox="0 0 682.667 682.667"
                  >
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path
                          d="M0 512h512V0H0Z"
                          data-original="#000000"
                        ></path>
                      </clipPath>
                    </defs>
                    <g
                      clipPath="url(#a)"
                      transform="matrix(1.33 0 0 -1.33 0 682.667)"
                    >
                      <path
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="40"
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
                {errors?.username && (
                  <p className="text-red-700 text-[14px] font-medium">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="mt-8">
                <label className="text-gray-800 text-xs block mb-2">
                  Mật khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Vui lòng điền mật khẩu !",
                      },
                      minLength: {
                        value: 6,
                        message: "Mật khẩu ít nhất 6 kí tự !",
                      },
                    })}
                    type={isPasswordVisible ? "text" : "password"}
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    onChange={() => {
                      if (errors.loginError) {
                        clearErrors("loginError");
                      }
                    }}
                    placeholder="Nhập password"
                    autoComplete="off"
                  />
                  <div
                    className="hidden_password absolute right-2 cursor-pointer"
                    onClick={() => {
                      setIsPasswordVisible((state) => !state);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] "
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                    {isPasswordVisible ? (
                      ""
                    ) : (
                      <span
                        className={`absolute w-[18px] h-[2px] bg-[#bbb] rotate-45 top-[8px]`}
                      ></span>
                    )}
                  </div>
                </div>
                {errors?.password && (
                  <p className="text-red-700 text-[14px] font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {errors?.loginError && (
                <p className="text-red-700 text-[14px] font-medium">
                  {errors.loginError.message}
                </p>
              )}
              <div className="mt-12">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
          <div className="flex-auto flex-shrink-0 flex flex-col gap-3">
            <div className="flex items-center justify-center ">
              <div className="w-[300px]">
                <img
                  src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/backgrounds/logo-light.svg"
                  className="w-full object-cover"
                ></img>
              </div>
            </div>
            <h2 className="slogan text-[20px] text-center">
              Nền tảng âm nhạc được yêu thích tại Việt Nam
            </h2>
          </div>
        </div>
      </div>
      {/* <Loading/> */}
    </div>
  );
};

export default Login;
