import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSwipeable } from "react-swipeable";

interface BlurUpImageProps extends React.ImgHTMLAttributes<HTMLImageElement> { }

interface Strategy {
  title: string;
  description: string;
  media: Array<{
    type: "image" | "video";
    url: string;
  }>;
  subMedia: Array<{
    type: "image" | "video";
    url: string;
  }>;
}

const strategies: Strategy[] = [
  {
    title: "Hybrid Trend-Following",
    description:
      "Fusing qualitative insights with quantitative data to capture trends of the future.",
    subMedia: [
      { type: "image", url: "trend-follow1desk.webp" },
      { type: "image", url: "trend-follow2desk.webp" },
      { type: "image", url: "trend-follow3desk.webp" },
      { type: "image", url: "trend-follow4desk.webp" },
      { type: "image", url: "trend-follow5desk.webp" },
      { type: "image", url: "trend-follow1mob.webp" },
      { type: "image", url: "trend-follow2mob.webp" },
      { type: "image", url: "trend-follow3mob.webp" },
      { type: "image", url: "trend-follow4mob.webp" },
      { type: "image", url: "trend-follow5mob.webp" },
    ],
    media: [
      {
        type: "image",
        url: "/trend-following.png",
      },
    ],
  },
  {
    title: "Statistical Arbitrage",
    description:
      "Uncovering future asset relationships beyond historical patterns",
    subMedia: [
      { type: "image", url: "stat-arbt1desk.webp" },
      { type: "image", url: "stat-arbt2desk.webp" },
      { type: "image", url: "stat-arbt3desk.webp" },
      { type: "image", url: "stat-arbt4desk.webp" },
      { type: "image", url: "stat-arbt5desk.webp" },
      { type: "image", url: "stat-arbt1mob.webp" },
      { type: "image", url: "stat-arbt2mob.webp" },
      { type: "image", url: "stat-arbt3mob.webp" },
      { type: "image", url: "stat-arbt4mob.webp" },
      { type: "image", url: "stat-arbt5mob.webp" },
    ],
    media: [{ type: "image", url: "/stat-arbitrage.png" }],
  },
  {
    title: "Options Arbitrage",
    description:
      "Utilizing the market inefficiencies in options space from pricing to liquidity dislocations.",
    subMedia: [{ type: "image", url: "Options_Arbitragemob.jpg" }],
    media: [{ type: "image", url: "/gamma-scale.png" }],
  },
];

function getFilteredStrategies(): Strategy[] {
  const isMobile = window.innerWidth < 640;
  return strategies.map((strategy) => {
    if (
      strategy.title === "Hybrid Trend-Following" ||
      strategy.title === "Statistical Arbitrage"
    ) {
      return {
        ...strategy,
        subMedia: strategy.subMedia.filter((item) =>
          item.type === "image"
            ? isMobile
              ? item.url.includes("mob")
              : item.url.includes("desk")
            : true
        ),
      };
    }
    return strategy;
  });
}

const BlurUpImage: React.FC<BlurUpImageProps> = ({ src, alt, style, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      // style={{
      //   // filter: isLoaded ? "none" : "blur(10px)",
      //   opacity: isLoaded ? 1 : 0,
      //   transition: "filter 0.05s cubic-bezier(0.05, 0.05, 0.05, 0.05), opacity 0.05s ease-in-out",
      //   ...style,
      // }}


      {...props}
    />
  );
};

const Works = () => {
  const [open, setOpen] = useState(false);
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  useEffect(() => {
    console.log("Current media index:", currentMediaIndex);
  }, [currentMediaIndex]);

  const handleStrategyClick = (strategy: Strategy) => {
    setCurrentStrategy(strategy);
    setCurrentMediaIndex(0);
    setOpen(true);
  };

  const handleNext = () => {
    if (currentStrategy) {
      setCurrentMediaIndex((prev) => {
        const next = prev === currentStrategy.subMedia.length - 1 ? 0 : prev + 1;
        return next;
      });
    }
  };

  const handlePrev = () => {
    if (currentStrategy) {
      setCurrentMediaIndex((prev) => {
        const next = prev === 0 ? currentStrategy.subMedia.length - 1 : prev - 1;
        return next;
      });
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  // Memoize the filtered strategies to avoid unnecessary recalculations.
  const filteredStrategies = useMemo(() => getFilteredStrategies(), []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24">
        <motion.div
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-8 font-funnel">
            The Works
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 md:p-0 px-10 md:px-6">
            {filteredStrategies.map((strategy) => (
              <Card
                key={strategy.title}
                className="glass-card overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleStrategyClick(strategy)}
              >
                <div className="bg-white/0">
                  {/* Using BlurUpImage for a smooth image load effect */}
                  <BlurUpImage
                    src={strategy.media[0].url || "/placeholder.svg"}
                    alt={strategy.title}
                    className="w-full h-32 sm:h-64 md:h-full"
                  />
                </div>
                <div className="p-2 sm:p-6">
                  <h2 className="text-sm md:text-2xl mb-0 md:mb-3 font-semibold font-funnel">
                    {strategy.title}
                  </h2>
                  <p className="text-gray-400 font-funnel text-xs md:text-lg">
                    {strategy.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[90vw] bg-trading-card border-trading-primary/20 p-0">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-2 top-16 z-50 rounded-full bg-black/50 p-2 hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          {currentStrategy && (
            <div {...swipeHandlers} className="relative h-[100vh] lg:h-[90vh] touch-pan-y">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStrategy.subMedia[currentMediaIndex]?.url}
                  // initial={{ opacity: 0 }}
                  // animate={{ opacity: 1 }}
                  // exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full w-full flex items-center justify-center"
                >
                  {currentStrategy.subMedia[currentMediaIndex].type === "video" ? (
                    currentStrategy.subMedia[currentMediaIndex].url.includes("youtube.com") ? (
                      <iframe
                        className="w-full h-full object-contain"
                        src={currentStrategy.subMedia[currentMediaIndex].url}
                        title="YouTube Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        src={currentStrategy.subMedia[currentMediaIndex].url}
                        className="w-full h-full object-contain"
                        controls
                      />
                    )
                  ) : (
                    <BlurUpImage
                      src={currentStrategy.subMedia[currentMediaIndex].url || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {currentStrategy.subMedia.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentMediaIndex ? "bg-trading-primary" : "bg-white/50"
                      }`}
                    onClick={() => setCurrentMediaIndex(index)}
                  />
                ))}
              </div>

              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors hidden sm:block"
              >
                <span className="sr-only">Previous</span>←
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors hidden sm:block"
              >
                <span className="sr-only">Next</span>→
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Works;
