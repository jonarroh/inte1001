import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-md mx-auto">
        <div className="px-6 py-4">
          <h2 className="text-gray-700 text-3xl font-semibold">Login</h2>
          <p className="mt-1 text-gray-600">Please login to your account.</p>
        </div>
        <div className="px-6 py-4">
          <form>
            <div className="mt-4">
              <label className="block text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-2 rounded w-full px-3 py-2 text-gray-700 bg-gray-200 outline-none focus:bg-gray-300"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-2 rounded w-full px-3 py-2 text-gray-700 bg-gray-200 outline-none focus:bg-gray-300"
                required
              />
            </div>
            <div className="mt-6">
              <Button type="submit" className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-600 w-full">
                Iniciar sesión
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}