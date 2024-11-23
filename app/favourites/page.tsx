'use client';

import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<any[]>([]);

  useEffect(() => {
    const storedFavourites = localStorage.getItem('favorites');
    if (storedFavourites) {
      setFavourites(JSON.parse(storedFavourites));
    }
  }, []);

  const removeFavorite = (id: number) => {
    const updatedFavorites = favourites.filter((movie) => movie.id !== id);
    setFavourites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (favourites.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Favourites</h1>
        <p>No favourites added yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Favourites</h1>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        className="p overflow-visible w-full"
      >
        <CarouselContent className="overflow-visible pt-10 pb-10 w-full">
          {favourites.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="basis-1/8 overflow-visible relative group"
            >
              <Link href={`/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                  style={{ objectFit: "cover", height: "300px" }}
                />
              </Link>
              <button onClick={() => removeFavorite(movie.id)}>Remove</button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}