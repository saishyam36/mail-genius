import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-600 shadow-md">
        <div className="flex items-center justify-between px-6 py-2">
            <div className="text-lg font-semibold text-white">Mail Genius</div>
            <div className="flex justify-evenly">
                <Button variant="outline" className="font">Login</Button>
                <Button variant="outline">Sign Up</Button>
            </div>
        </div>
    </nav>
  );
}
  