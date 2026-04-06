import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-24 text-center">
      <div className="results-top-nav w-full max-w-7xl mb-12">
        <Link href="/" className="btn-back">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <h1 className="text-9xl font-black text-[#0060A9] opacity-10 mb-[-2rem]">404</h1>
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Data Not Found</h2>
      <p className="text-lg text-gray-600 max-w-md mb-10 leading-relaxed">
        The player or record you are looking for does not exist in our library. 
        Please check the FIDE ID or search for another player.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="bg-[#0060A9] hover:bg-[#004d88] h-12 px-8 font-semibold">
            <Home className="w-4 h-4 mr-2" /> Return to Library
          </Button>
        </Link>
      </div>
    </div>
  );
}
