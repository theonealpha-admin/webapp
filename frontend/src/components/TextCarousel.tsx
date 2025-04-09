"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface TextCarouselProps {
  text: string;
}

// Split the text into sentences and then into two parts (carousel slides)
const splitBioIntoTwo = (text: string): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  // If we cannot split into sentences or there is only one sentence, return the full text as one slide
  if (!sentences || sentences.length < 2) return [text];
  const mid = Math.ceil(sentences.length / 2);
  const firstHalf = sentences.slice(0, mid).join(" ");
  const secondHalf = sentences.slice(mid).join(" ");
  return [firstHalf.trim(), secondHalf.trim()];
};

export default function TextCarousel({ text }: TextCarouselProps) {
  const textChunks = splitBioIntoTwo(text);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full mt-1">
      <Carousel className="w-full h-full" setApi={setApi}>
        <CarouselContent>
          {textChunks.map((chunk, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex p-2 h-auto">
                  <p className="text-gray-300 text-[15px] leading-relaxed text-justify md:text-lg font-funnel">
                    {chunk}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Optionally include navigation buttons if needed */}
        {/* <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" /> */}
      </Carousel>
      <div className="flex justify-center gap-2 mt-4">
        {textChunks.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === current ? "bg-primary" : "bg-gray-300"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
