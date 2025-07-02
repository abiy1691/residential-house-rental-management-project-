import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {resetPassword} from '../api/auth';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const errorClass = ' border-red-400 dark:border-red-500'

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [error, setError] = useState('');
  const {token} = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: resetPassword,
    onError: err => {
      setError(err.message)
    },
    onSuccess: res => {
        queryClient.setQueryData(['user'], res);
        navigate('/');
        setError(false)
    }
  });
  let passwordError = false
  let cpasswordError = false
  if (password && password.length < 7)
    passwordError = true
  if (cpassword && cpassword !== password)
    cpasswordError = true


  useEffect(()=>{
    if (error!='')
        toast.error(error)
  }, [error]);
  
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset Password Page
            </h1>
            <form
              className="space-y-4 text-center md:space-y-6"
              action="#"
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordError) {
                    setError('Password too short')
                    return
                }
                if (cpasswordError) {
                    setError('Passwords doesn\'t match')
                    return
                }
                mutation.mutate({password, token})                    
              }}
            >
                <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Carefully set your passowrd here and submit.</p>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                  Please enter password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  name="password"
                  id="password"
                  className={"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:outline-none " + (passwordError&&errorClass)}
                  placeholder="Password"
                  required=""
                />
                  {passwordError && <p className="mt-1 text-xs text-red-600 dark:text-red-500 text-left">Password must be more than 6 characters.</p>}
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
                >
                  Confirm Password
                </label>
                <input
                  onChange={(e) => setCPassword(e.target.value)}
                  value={cpassword}
                  type="password"
                  name="confirmpassword"
                  id="confirmpassword"
                  className={"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:outline-none dark:focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white " + (cpasswordError&&errorClass)}
                  placeholder="Confirm Password"
                  required=""
                />
              
              <button
                type="submit"
                className="w-full text-white  bg-[#234B9A] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Change Password
              </button>
              </form>
          </div>
        </div>
      </div>
    </section>  
  );
}

export default ResetPassword;
