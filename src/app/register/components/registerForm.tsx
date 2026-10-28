"use client";
import { register } from "@/app/actions/register";
import { RegisterSchema } from "@/utilities/input-validator";
import { useUserReducer } from "@/reducers/user/user.hook";

export const RegisterForm: React.FC = () => {
  const {
    state: { user, error, loading },
    addUser,
    startLoading,
    showError,
  } = useUserReducer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    const result = RegisterSchema.safeParse(user);
    if (!result.success) {
      const errors: Error[] = JSON.parse(result.error.message);
      showError(errors[0].message);
      return;
    }
    await register({ ...user, fullName: user.fullName ?? "" }).then((res) => {
      if (res) showError(res);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    addUser({ ...user, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              value={user.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-60 cursor-pointer"
            disabled={loading}
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};
