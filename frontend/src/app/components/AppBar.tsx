'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';


const Navbar: React.FC = () => {
  const router = useRouter();

  const handleSignOut = () => {
    // Implement your signout logic here
    router.push('/');
    console.log('Signing out...');
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/pages/map" className="text-white text-lg font-bold">
              App
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/pages/map" className="text-white hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Annotation
            </Link>
            <Link href="/pages/map" className="text-white hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Model
            </Link>
          </div>
          <div className="ml-4 md:ml-0">
            <button
              onClick={handleSignOut}
              className="text-white hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
