import React, { useState } from 'react';

function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform sign-up logic, e.g., send data to a server
    console.log('Form submitted:', formData);
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label class ="block">First Name:</label>
          <input
            type="text"
            id="firstName"
            class="mt-1 block w-full" placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label class="block">Last Name:</label>
          <input
            type="text"
            id="lastName"
            class="mt-1 block w-full" placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label class="block">Email:</label>
          <input
            type="email"
            id="email"
            class="mt-1 block w-full"
            placeholder="jennyrocks@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label class="block">Password:</label>
          <input
            type="password"
            id="password"
            class="mt-1 block w-full"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpPage;
