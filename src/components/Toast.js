import React, { useState } from 'react';

export function ToastComponent({ message, type, isVisible }) {
  const toastClass = type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white';

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div class="max-w-xs bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700" role="alert" style={{position: 'absolute', bottom: '10px', right: '10px'}}>
      <div class="flex p-4">
        <div class="flex-shrink-0">
          <svg class="h-4 w-4 text-red-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-gray-700 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Toast() {
  const [isToastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const showError = () => {
    setToastMessage('An error occurred');
    setToastType('error');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // hide the toast after 3 seconds
  };

  const showSuccess = () => {
    setToastMessage('Operation successful');
    setToastType('success');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // hide the toast after 3 seconds
  };

  return (
    <div style={{position: 'relative'}}>
      <button onClick={showError}>Show Error</button>
      <button onClick={showSuccess}>Show Success</button>
      <ToastComponent message={toastMessage} type={toastType} isVisible={isToastVisible} />
    </div>
  );
}