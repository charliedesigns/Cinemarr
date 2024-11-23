"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function Page({ params }: { params: { slug: string } }) {
  const [item, setItem] = useState<any>(null);
  const [credits, setCredits] = useState<
    { id: number; name: string; profile_path: string }[]
  >([]);
  const [watchProviders, setWatchProviders] = useState<any[]>([]);
  const [trailer, setTrailer] = useState<{ key: string } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [director, setDirector] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchDetails = () => {
    const url = `https://api.themoviedb.org/3/movie/${params.slug}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setItem(json))
      .catch((err) => console.error(err));
  };

  const fetchCredits = () => {
    const creditsUrl = `https://api.themoviedb.org/3/movie/${params.slug}/credits?language=en-US`;
    const creditsOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API}`,
      },
    };

    fetch(creditsUrl, creditsOptions)
      .then((res) => res.json())
      .then((json) => {
        setCredits(json.cast);
        const director = json.crew.find(
          (person: any) => person.job === "Director"
        );
        setDirector(director ? director.name : null);
      })
      .catch((err) => console.error(err));
  };

  const fetchWatchProviders = () => {
    const url = `https://api.themoviedb.org/3/movie/${params.slug}/watch/providers?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setWatchProviders(json.results?.US?.flatrate || []))
      .catch((err) => console.error(err));
  };

  const fetchTrailer = () => {
    const url = `https://api.themoviedb.org/3/movie/${params.slug}/videos?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        const trailer = json.results.find(
          (video: any) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailer(trailer || json.results[0]);
      })
      .catch((err) => console.error(err));
  };

  const toggleFavorite = () => {
    const storedFavorites = localStorage.getItem("favorites");
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    if (isFavorite) {
      favorites = favorites.filter((movie: any) => movie.id !== item.id);
    } else {
      favorites.push({
        id: item.id,
        title: item.title,
        poster_path: item.poster_path,
      });
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };



  useEffect(() => {
    fetchDetails();
    fetchCredits();
    fetchWatchProviders();
    fetchTrailer();
  }, [params.slug]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      setIsFavorite(favorites.some((movie: any) => movie.id === item?.id));
    }
  }, [item]);

  if (!item || !credits) {
    return (
      <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:pt-5 sm:pl-80 sm:pr-80 font-[family-name:var(--font-poppins)] overflow-visible">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start flex-wrap overflow-visible w-full">
          <div className="flex flex-row gap-12">
            <div>
              <Skeleton className="h-[500px] w-[350px] rounded-xl" />
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-72" />
                <div className="flex flex-row gap-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="w-2/3 gap-4 flex flex-col">
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-52 w-96" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:pt-5 sm:pl-80 sm:pr-80 font-[family-name:var(--font-poppins)] overflow-visible">
      
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start flex-wrap overflow-visible w-full">
        <div className="flex flex-row gap-12">
          <div>
            <Image
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title}
              width={1100}
              height={220}
              className="rounded-2xl "
            />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
              <p className="text-base font-normal">{item.adult ? "18+" : "PG-13"}</p>
              <p>
                  {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
                </p>
              </div>
              <h1 className="text-4xl font-semibold">{item.title}</h1>
              <div className="flex flex-row gap-3">
                {director && (
                  <p className="text-base font-normal">{director}</p>
                )}
                <p className="text-base font-normal">
                  {new Date(item.release_date).getFullYear()}
                </p>
                <p className="text-base font-normal">
                  ⭐ {item.vote_average.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="w-2/3 gap-1 flex flex-col">
              <h2 className="text-2xl font-medium">Overview</h2>
              <p>{item.overview}</p>
            </div>
            <div className="flex flex-row gap-2">
              <Button className="text-base" onClick={toggleFavorite}>
                {isFavorite ? "❤️" : "♡"}
              </Button>
              <Link
                href={
                  trailer
                    ? `https://www.youtube.com/watch?v=${trailer.key}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="text-base">🎬</Button>
              </Link>
              <Dialog>
                <DialogTrigger>
                  <Button className="text-base">Watch Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Watch Now</DialogTitle>
                    <DialogDescription>
                      Here are some options to watch this movie now.
                    </DialogDescription>
                    {watchProviders.length > 0 ? (
                      watchProviders.map((provider: any) => (
                        <Link href="">
                          <Card
                            key={provider.provider_id}
                            className="flex flex-row gap-2 justify-between items-center p-2"
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w200/${provider.logo_path}`}
                              alt={provider.provider_name}
                              width={50}
                              height={50}
                              className="rounded-lg"
                            />
                            <h2 className="font-semibold">
                              {provider.provider_name}
                            </h2>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <p>No watch providers available.</p>
                    )}
                    <DialogFooter>Powered by JustWatch</DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h1 className="text-2xl font-semibold">Cast</h1>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="p overflow-visible w-full snap-x"
          >
            <CarouselContent className="overflow-visible pt-10 pb-10 w-full">
              {credits?.map((person) => (
                <CarouselItem
                  key={person.id}
                  className="basis-1/8 overflow-visible relative group"
                >
                  <Link href="/">
                    <Image
                      src={`https://image.tmdb.org/t/p/w200/${person.profile_path}`}
                      alt={person.name}
                      width={200}
                      height={300}
                      className="rounded-full shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                      style={{
                        objectFit: "cover",
                        height: "200px",
                        width: "200px",
                      }}
                    />
                    <p className="text-center mt-2">{person.name}</p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>
    </div>
  );
}
