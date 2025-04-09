import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Card } from "../components/ui/card";
import { motion } from "framer-motion";
import {
  LineChartIcon as ChartLine,
  BookOpen,
  Users,
  LogIn,
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      title: "The Works",
      description: "Explore our suite of proprietary in-house strategies.",
      icon: <ChartLine className="h-6 w-6 text-trading-primary" />,
      path: "/works",
    },
    {
      title: "Get Enlightened",
      description: "Where complexity is reduced, jargon deconstructed.",
      icon: <BookOpen className="h-6 w-6 text-trading-primary" />,
      path: "/enlightened",
    },
    {
      title: "The People",
      description: "Get to know the minds behind.",
      icon: <Users className="h-6 w-6 text-trading-primary" />,
      path: "/people",
    },
    {
      title: "Login",
      description: "For Partners access only.",
      icon: <LogIn className="h-6 w-6 text-trading-primary" />,
      path: "/login",
    },
  ];

  return (
    <div className="min-h-screen h-screen bg-black flex flex-col">
      <Navigation />

      {/* Main content section */}
      <main className="flex-1 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover  bg-no-repeat"
          style={{
            backgroundImage: "url('/uploads/herobg.png')",
            opacity: 0.9,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center space-y-12 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-4xl"
            >
              <h1 className="text-[6vw] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight font-funnel text-center whitespace-nowrap">
                from <span>CHAOS</span> | we sculpt <span>ORDER</span>
              </h1>
            </motion.div>

            {/* Features Grid */}
            <div className="w-full max-w-3xl mx-auto px-4">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-md mx-auto ">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={feature.path} className="block h-full">
                      <Card className="glass-card h-full p-4 md:p-6 group cursor-pointer flex flex-col">
                        <div className=" mb-2 transform group-hover:scale-105 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h2 className="text-sm sm:text-lg font-semibold mb-1 text-white group-hover:text-trading-primary transition-colors font-funnel">
                          {feature.title}
                        </h2>
                        <p className="text-xs text-gray-300 group-hover:text-white transition-colors font-funnel">
                          {feature.description}
                        </p>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
