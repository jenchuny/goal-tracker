import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseUtils';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate('/goals')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
;
  };

  return (
    <html class="w-full">
    <body class="dark:bg-slate-900 bg-gray-100 w-full pt-10 px-4 sm:px-6 md:px-8 lg:pl-72"> 
      <main class="w-full max-w-md mx-auto p-6">
        <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 grid">
          <div class="p-4 sm:p-7">
            <div class="text-left">
              <h1 class="block text-3xl font-bold text-gray-800 dark:text-white">Get started! 💪</h1>
            </div>  
              <form onSubmit={signUp}>
              <div class="grid">
                    <div class="relative mb-5">
                    <label for="email" class="block text-sm mb-2 dark:text-white">Email address</label>
                    <div class="relative">
                      <input type="email" id="email" name="email" class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="email-error" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                      <div class="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                        <svg class="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                        </svg>
                      </div>
                    </div>
                    <p class="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address.</p>
                  </div>

                  <div>
                    <label for="password" class="block text-sm mb-2 dark:text-white">Password</label>
                    <div class="relative mb-5">
                      <input type="password" id="password" name="password" class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="password-error" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                      <div class="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                        <svg class="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                        </svg>
                      </div>
                    </div>
                    <p class="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                  </div>
  
                  <button type="submit" class="py-3 px-4 mb-5 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-slate-950 text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Sign up</button>
                </div>
                
              </form>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Already have an account? 
                <Link class="text-orange-600 decoration-2 hover:underline font-medium" to="/login">
                  Sign in here
                </Link>
              </p>
            </div>
        </div>
      </main>
    </body>
  </html>
  );
}

export default SignUpPage;
