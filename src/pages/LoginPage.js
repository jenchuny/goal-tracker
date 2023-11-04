import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseUtils';
import { Link, useNavigate } from 'react-router-dom';
import { ToastComponent } from '../components/Toast';

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isToastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const showError = (message) => {
    setToastMessage(message);
    setToastType('error');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // hide the toast after 3 seconds
  };

  const logIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate('/this-week');
      })
      .catch((error) => {
        showError('Sorry, we could not log you in. Please try again.');
        console.log(error);
      });
      
  };

  return (
    <div className="w-full">
      <div className="dark:bg-slate-900 bg-gray-100 w-full pt-10 px-4 sm:px-6 md:px-8 lg:pl-72">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 grid">
            <div className="p-4 sm:p-7">
              <div className="text-left">
                <h1 className="block text-3xl font-bold text-gray-800 dark:text-white">Welcome Back!</h1>
              </div>  
              <form onSubmit={logIn}>
              <div className="grid">
                  <div className="relative mb-5">
                    <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                    <input type="email" id="email" name="email" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="email-error" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </div>
                    <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                  </div>
                  <div className="relative mb-5">
                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                    <input type="password" id="password" name="password" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="password-error" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="grid">
                    <button type="submit" className="py-3 px-4 mb-5 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-slate-950 text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Log In</button>
                  </div>
                </div>
              </form>
              <div>
                <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
                  Don't have an account?  
                  <Link className="text-orange-600 decoration-2 hover:underline font-medium" to="/signup">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastComponent message={toastMessage} type={toastType} isVisible={isToastVisible} />
    </div>
  );
}

export default LoginPage;
