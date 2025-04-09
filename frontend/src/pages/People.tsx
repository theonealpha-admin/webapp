import Navigation from "@/components/Navigation";
import TextCarousel from "@/components/TextCarousel";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Jatin Singh",
    role: "Founder",
    image: "/myp.jpg",
    bio: `The early years (2003–2005) saw him as a ring trader at a local broker, marked by relentless
efforts to chase market tips and the pursuit of quick profits. Losses were frequent, but they
laid the foundation for understanding what not to do.
Inspired by setbacks and failures, he taught himself everything necessary to make sense of
the puzzle. A disciplined approach emerged, allowing him to navigate the turbulence of the
2008 global bear market with a net short portfolio.
Between 2009 and 2012, curiosity led him to explore programming, enabling him to
transition into systematic trading. This shift allowed him to develop and implement
strategies across global currency and commodity markets.By 2016, his journey expanded into statistical arbitrage, diving deep into data and
mathematics to achieve consistency and a higher Sharpe ratio.`,
    setupImages: ["/people.jpg", "/people.jpg"],
    setupDescription:
      "High-performance trading setup with multiple monitors for real-time market analysis and automated trading systems.",
  },
  {
    name: "Tarun Singh",
    role: "CO-Founder",
    image: "/myp.jpg",
    bio: `In 2013 Dropped out of school, His first book, Trading for Dummies, set him on a path from trading to programming across
multiple languages. By 2014, Developed and programmed his first systematic trading system, executing trades in major commodities on Indian exchanges and the Globex. By 2016 to 2017, Began back testing complex strategies in the options and arbitrage space.
He found his passion in deep quant, an intersection of computer science, market microstructure, and applied math, uncovering alpha in places others might overlook. 2021, Continuous research and development keep him engaged, with his curiosity leading him into the evolving world of artificial intelligence and its potential applications in trading.`,
    setupImages: ["/people.jpg", "/people.jpg"],
    setupDescription:
      "Custom-built workstation optimized for complex computational tasks and algorithm development.",
  },
];

const TeamMember = ({ member, isEven, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Image block removed for clarity; uncomment if needed */}
        <div className={`space-y-4 ${!isEven ? "md:order-1" : ""}`} style={{ maxWidth: "100%" }}>
          <h2 className="text-xl md:text-3xl font-bold font-funnel">
            {member.name} <span className="text-trading-primary text-lg md:text-3xl font-funnel ml-2">({member.role})</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-funnel">
            {/* Mobile view: TextCarousel with the overridden height */}
            <span className="md:hidden block">
              <TextCarousel text={member.bio} />
            </span>
            {/* Desktop view: Full bio */}
            <span className="hidden md:block" style={{ padding: "0 10px" }}>{member.bio}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const People = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* <h1 className="text-xl sm:text-3xl font-bold mb-3 md:mb-12 font-funnel">
            The people and the story
          </h1> */}
          <div className="space-y-6 md:space-y-12">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={member.name}
                member={member}
                isEven={index % 2 === 0}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default People;
