import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFetcher } from "react-router-dom";

export default function LoginPage() {

  const feacher = useFetcher();

  const [email, setemail] = useState('jonarrodi99@gmail.com');
  const [password, setpassword] = useState('Ganondorf09#');


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-md mx-auto">
        <div className="px-6 py-4">
          <h2 className="text-gray-700 text-3xl font-semibold">Login</h2>
          <p className="mt-1 text-gray-600">Please login to your account.</p>
        </div>
        <div className="px-6 py-4">
          <feacher.Form method="post" action="/">
            <div className="mt-4">
              <label className="block text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-2 rounded w-full px-3 py-2 text-gray-700 bg-gray-200 outline-none focus:bg-gray-300"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="mt-2 rounded w-full px-3 py-2 text-gray-700 bg-gray-200 outline-none focus:bg-gray-300"
                required
              />
            </div>
            <div className="mt-6">
              <Button type="submit" className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-600 w-full">
                Iniciar sesión
              </Button>
            </div>
          </feacher.Form>
        </div>
      </div>
    </div>
  )
}