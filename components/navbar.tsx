"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Input } from './ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e:any) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?query=${searchQuery}`);
        }
    };

    return (
        <div className="sm:pl-80 sm:pr-80">
            <nav className="flex items-end px-0 py-4 gap-4">
                <div className="flex items-center ">
                    <Link href="/">
                        <Image src='/cinemarr.svg' width={200} height={50} alt="Cinemarr Logo"/>
                    </Link>
                </div>
                <div className='flex flex-row gap-3'>
                    <Link href="/" >
                        <h3 className='text-xl font-medium'>home</h3>
                    </Link>
                    <Link href="/favourites" >
                        <h3 className='text-xl font-medium'>favourites</h3>
                    </Link>
                </div>
                <div className="flex-grow"></div>
                <form onSubmit={handleSearch} className="flex justify-end items-center">
                    <Search className="mr-2 h-5 w-5" />
                    <Input 
                        type="text" 
                        placeholder="Search for movies..." 
                        className="w-80 p-2 border mr-4 rounded-lg shadow-sm focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </nav>
        </div>
    );
};

export default Navbar;