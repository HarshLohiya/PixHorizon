"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirect
    });

    if (result?.error) {
      alert("Login failed. Please check your credentials.");
    } else {
      router.push("/"); // Redirect to the home page after successful login
    }
  };

  const handleGoogleLogin = () => {
    signIn("google"); // Trigger Google login
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center bg-green-200 p-16">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
          <h2 className="text-2xl font-bold text-center text-black">Login</h2>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-black"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-black"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Login with Google
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm">
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </div>
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

//OLD ONE

// "use client";

// import { useSession, signIn, signOut } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const result = await signIn("email", {
//       email,
//       redirect: false, // Prevent automatic redirect
//     });

//     if (result?.error) {
//       alert("Login failed. Please check your credentials.");
//     } else {
//       router.push("/"); // Redirect to the home page after successful login
//     }
//   };

//   const handleGoogleLogin = () => {
//     signIn("google"); // Trigger Google login
//   };

//   return (
//     <div>
//       <Header />
//       <div className="flex items-center justify-center bg-green-200 p-16">
//         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
//           <h2 className="text-2xl font-bold text-center text-black">Login</h2>
//           <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <label htmlFor="email" className="sr-only">
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-black"
//                   placeholder="Email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Login with Email
//               </button>
//             </div>

//             <div>
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 className="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 Login with Google
//               </button>
//             </div>
//           </form>

//           <div className="flex items-center justify-between mt-4">
//             <div className="text-sm">
//               <Link
//                 href="/signup"
//                 className="font-medium text-indigo-600 hover:text-indigo-500"
//               >
//                 Sign up
//               </Link>
//             </div>
//             <div className="text-sm">
//               <Link
//                 href="/forgot-password"
//                 className="font-medium text-indigo-600 hover:text-indigo-500"
//               >
//                 Forgot your password?
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
