"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";


import Link from "next/link";

export default function Home() {
  const [movies, setMovies] = useState<{ id: number; title: string; backdrop_path: string; release_date: string; rating: number; poster_path: string }[]>([]);
  const [goat, setGoat] = useState<{ id: number; title: string; poster_path: string }[]>([]);
  const [people, setPeople] = useState<{ id: number; name: string; profile_path: string }[]>([]);
  const [favorites, setFavorites] = useState<{ id: number; title: string; poster_path: string }[]>([]);

  const fetchTrending = () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/trending/movie/day?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setMovies(json.results))
      .catch((err) => console.error(err));
  };

  const fetchGOAT = () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/movie/top_rated?language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setGoat(json.results));
  };

  const fetchPopularPeople = () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/trending/person/week?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setPeople(json.results));
  };

  useEffect(() => {
    console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log("API Key:", process.env.NEXT_PUBLIC_API);
    fetchTrending();
    fetchGOAT();
    fetchPopularPeople();
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  
  const removeFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (movies.length === 0 || goat.length === 0 || people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:pt-5 sm:pl-80 sm:pr-80 font-[family-name:var(--font-poppins)] overflow-visible">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start flex-wrap overflow-visible w-full">
          <div className="w-full">
            <Skeleton className="h-[32rem] w-full rounded-xl" />
          </div>
          <div className="w-full">
            <h1 className="text-3xl font-semibold">Popular movies today</h1>
            <div className="flex gap-4 overflow-visible pt-10 pb-10 w-full">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-[300px] w-[200px] rounded-xl" />
              ))}
            </div>
          </div>
          <div className="w-full">
            <h1 className="text-3xl font-semibold">Popular people this week</h1>
            <div className="flex gap-4 overflow-visible pt-10 pb-10 w-full">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-[200px] w-[200px] rounded-full" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:pt-5 sm:pl-80 sm:pr-80 font-[family-name:var(--font-poppins)] overflow-visible">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start flex-wrap overflow-visible w-full">


        <div className="w-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 10000,
              }),
            ]}
            className="p overflow-visible w-full"
          >
            <CarouselContent className="overflow-visible w-full snap-x">
              {movies?.map((movies) => (
                <CarouselItem key={movies.id} className="overflow-visible w-full">
                    <Link href={`/${movies.id}`}>
                    <div
                        className="w-full h-[32rem] bg-cover bg-center rounded-xl shadow-lg transition-all duration-300 flex items-end"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movies.backdrop_path})`,
                      }}
                    >
                      <div
                        className="flex flex-col text-white p-8 w-full bg-gradient-to-t from-black/70 to-transparent rounded-xl"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                      >
                        <h1 className="text-3xl font-semibold">
                          {movies.title}
                        </h1>
                        <h3 className="text-xl text-white pt-0">
                          {new Date(movies.release_date).getFullYear()}
                        </h3>
                        <p>{movies.rating}</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold">Popular movies today</h1>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="p overflow-visible w-full"
          >
            <CarouselContent className="overflow-visible pt-10 pb-10 w-full">
              {movies?.map((movie) => (
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold">All time greats</h1>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="p overflow-visible w-full"
          >
            <CarouselContent className="overflow-visible pt-10 pb-10 w-full">
              {goat?.map((goat) => (
                <CarouselItem
                  key={goat.id}
                  className="basis-1/8 overflow-visible relative group"
                >
                  <Link href={`/${goat.id}`}>
                    <Image
                      src={`https://image.tmdb.org/t/p/w200/${goat.poster_path}`}
                      alt={goat.title}
                      width={200}
                      height={300}
                      className="rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                      style={{ objectFit: "cover", height: "300px" }}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold">Popular people this week</h1>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="p overflow-visible w-full snap-x"
          >
            <CarouselContent className="overflow-visible pt-10 pb-10 w-full">
              {people?.map((person) => (
                <CarouselItem
                  key={person.id}
                  className="basis-1/8 overflow-visible"
                >
                  <Link href="/">
                    <Image
                      src={`https://image.tmdb.org/t/p/w200/${person.profile_path}`}
                      alt={person.name}
                      width={200}
                      height={300}
                      className="rounded-full shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_5px_rgba(99,102,241,0.4)]"
                      style={{ objectFit: "cover", height: "200px", width: "200px" }}
                    />
                    <p className="text-center mt-2">{person.name}</p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold">Favorite Movies</h1>
          {favorites.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              className="p overflow-visible w-full"
            >
              <CarouselContent className="overflow-visible pt-10 pb-10 w-full">
                {favorites.map((movie) => (
                  <CarouselItem key={movie.id} className="basis-1/8 overflow-visible">
                    <Link href={`/${movie.id}`}>
                      <Image
                        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                        alt={movie.title}
                        width={200}
                        height={300}
                        className="rounded-xl shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_5px_rgba(99,102,241,0.4)]"
                        style={{ objectFit: "cover", height: "300px" }}
                      />
                    </Link>
                    <button onClick={() => removeFavorite(movie.id)}>Remove</button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <p>No favorite movies added yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}