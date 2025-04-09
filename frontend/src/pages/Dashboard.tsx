"use client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { AUTH_TOKEN } from "@/constants/auth";
import { X } from "lucide-react";

const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      // Adjust spring or duration for a snappier or smoother feel
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

interface Data {
  label: string;
  value: number;
}
interface CompareData {
  label: string;
  value1: number;
  value2: number;
}
interface GraphData {
  name: string;
  value1: number;
  value2: number;
  value3?: number;
}

interface FinancialData {
  stats: Data[];
  compareStats: CompareData[];
  performance: GraphData[];
  comparePerformance: GraphData[];
  labels: string[];
  comparisonSummary: string;
  dashboardSummary?: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [wholeData, setWholeData] = useState<FinancialData>();
  const [showHiddenData, setShowHiddenData] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("/data");
      if (data) {
        setWholeData(data);
      }
    } catch (error) {
      toast({
        title: "Data Failed",
        description: "Failed to fetch data. Something went wrong!",
        duration: 2500,
      });
      console.log(`error while fetching data ${error}`);
    }
  };

  console.log("wholeData", wholeData);
  console.log(
    "wholedata",
    wholeData?.compareStats[wholeData.compareStats.length - 1]
  );

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      <main className="container mx-auto px-6 lg:px-4 pt-32 pb-3 max-w-[1440px]"> {/* Updated padding and max-width to match Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto flex flex-col justify-center">
            <h1 className="text-2xl font-bold font-funnel mt-2 pb-4 px-1">Summary</h1>
            {wholeData?.dashboardSummary?.split("\n").map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 text-[16.5px] leading-relaxed text-left text-gray-300 px-1"
              >
                {paragraph.split(/([(),])/g).map((part, partIndex) => {
                  // If the part is a comma, parenthesis, or empty, return it as is
                  if (part.match(/^[(),]$/) || !part.trim()) {
                    return <span key={partIndex}>{part}</span>;
                  }

                  // Split the remaining parts by space to process individual words
                  return part.split(" ").map((word, wordIndex) => {
                    if (!word.trim()) return " ";

                    const number = parseFloat(word.replace(/[^0-9.-]/g, ""));
                    const isNumber = !isNaN(number);
                    const isNegative = isNumber && number < 0;
                    const isPositive = isNumber && number > 0;
                    const isHeading = word.endsWith(':') && paragraph.includes('✓');

                    const words = part.split(" ");
                    const currentWordIndex = words.indexOf(word);

                    // Find "The One Alpha Team" phrase
                    const teamPhrase = "The One Alpha Team";
                    const paragraphText = paragraph.toLowerCase();
                    const teamPhraseIndex = paragraphText.indexOf(teamPhrase.toLowerCase());
                    const currentWordStart = paragraphText.indexOf(word.toLowerCase());
                    const isPartOfTeam =
                      teamPhraseIndex !== -1 &&
                      currentWordStart >= teamPhraseIndex &&
                      currentWordStart < teamPhraseIndex + teamPhrase.length;

                    // Check for month year pattern (e.g., "April 2024")
                    const months = /^(January|February|March|April|May|June|July|August|September|October|November|December)$/;
                    const nextWord = words[currentWordIndex + 1];
                    const prevWord = words[currentWordIndex - 1];
                    const isDatePattern =
                      (months.test(word) && nextWord?.match(/^\d{4}$/)) ||
                      (word.match(/^\d{4}$/) && prevWord && months.test(prevWord));

                    // Check for score pattern (e.g., "9.2/10")
                    const isScore = /^\d+(\.\d+)?\/\d+$/.test(word);

                    // Check for standalone zero
                    const isStandaloneZero = word === "0" || word === " 0 ";

                    // Check for "variable model" phrase
                    const isVariableModelPhrase = 
                      (word === "Variable" && words[currentWordIndex + 1] === "Model") ||
                      (word === "Model" && words[currentWordIndex - 1] === "Variable");
                    const isdearsir = word === "Dear" || word === "Sir";
                    const isbestregards = word === "Best" || word === "Regards";
                    const iskeyperformancehighlights = 
                      word === "Key" || 
                      word === "Performance" || 
                      word === "Highlights" ||
                      word === "Highlights:";
                    const isreturns = word === "Returns:";
                    const isriskcomfortscore = word === "Risk" || word === "Comfort" || word === "Score:";
                    const isdrawdowns = word === "Drawdowns:";
                    const isbhaisaab = word === "Bhaisaab";
                    const isstability = word === "Stability:";



                    // Build className based on conditions
                    let className = "";
                    if (isPartOfTeam) {
                      className = "text-white font-bold";
                    } else if (isDatePattern) {
                      className = "text-white font-bold";
                    } else if (isHeading) {
                      className = "text-white font-bold";
                    } else if (isStandaloneZero) {
                      className = "text-red-500 font-bold";
                    } else if (isScore) {
                      className = "text-green-600 font-bold";
                    } else if (isVariableModelPhrase) {
                      className = "text-white font-bold";
                    } else if (isNegative) {
                      className = "text-red-500 font-bold";
                    } else if (isPositive && word.includes('%')) {
                      className = "text-trading-primary font-bold";
                    }
                    else if (isdearsir) {
                      className = "text-white font-bold";
                    }
                    else if (isbestregards) {
                      className = "text-white font-bold";
                    }
                    else if (isreturns) {
                      className = "text-white font-bold";
                    }
                    else if (isriskcomfortscore) {
                      className = "text-white font-bold";
                    }
                    else if (isdrawdowns) {
                      className = "text-white font-bold";
                    }
                    else if (iskeyperformancehighlights) {
                      className = "text-white font-bold";
                    }
                    else if (isbhaisaab) {
                      className = "text-white font-bold";
                    }
                    else if (isstability) {
                      className = "text-white font-bold";
                    }

                    return (
                      <span
                        key={`${partIndex}-${wordIndex}`}
                        className={className}
                      >
                        {word}{" "}
                      </span>
                    );
                  });
                })}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Hidden data container */}
        {showHiddenData && (
          <div className="fixed inset-0 flex flex-col h-auto bg-background/95 z-45 pt-24"> {/* Adjusted to match new navigation height */}
            <div className="container mx-auto max-w-[1440px] h-full px-2 lg:px-4 py-2"> {/* Reduced padding to match Navigation */}
              <div className="flex items-center justify-between py-2"> {/* Adjusted vertical padding */}
                <p className="text-[20px] sm:text-xl md:text-2xl lg:text-3xl font-funnel font-bold">
                  {wholeData?.compareStats[wholeData.compareStats.length - 1]?.label.trim()}
                </p>
                <button
                  onClick={() => setShowHiddenData(false)}
                  className="flex items-center justify-center h-15 w-10 text-gray-400 hover:text-gray-300"
                >
                  <X className="h-6 w-6" /> {/* Using Lucide-react X icon for consistency */}
                </button>
              </div>

              <div className={`flex flex-col ${showHiddenData ? 'lg:flex-row' : ''} gap-6 h-[calc(100vh-10rem)]`}> {/* Adjusted height calculation */}
                {/* Table container - reduced height in landscape mode */}
                <div className="w-full lg:w-[30%] h-[30vh] lg:h-[50%]">
                  <div className="h-full bg-gray-600/20 rounded-lg overflow-hidden"> {/* Added background and rounded corners */}
                    <Card className="h-full p-0"> {/* Removed default padding */}
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="rounded-lg shadow-lg h-full"
                        style={{
                          backgroundColor: "rgb(107 114 128 / var(--tw-bg-opacity))",
                        }}
                      >
                        <table className="w-full h-full text-center border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="h-10 py-0.5 px-2 font-semibold text-[20px] md:text-[22px] lg:text-[24px] text-gray-200 border-gray-700">
                                <div className="flex items-center justify-center h-full">

                                </div>
                              </th>
                              {wholeData?.labels?.map((label, index) => {
                                // Skip the "Current Investment" label
                                if (label === "Current Investment") return null;
                                return (
                                  <th
                                    key={index}
                                    className="h-10 py-0.5 px-1 font-semibold text-[18px] md:text-[22px] lg:text-[24px] text-gray-200 border-l border-gray-700"
                                  >
                                    <div className="flex items-center justify-center h-full">
                                      {label}
                                    </div>
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {wholeData?.compareStats?.slice(0, -1).map((comparison, index) => (
                              <motion.tr
                                key={index}
                                variants={itemVariants}
                                whileHover={{
                                  scale: 1.01,
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="border-b border-gray-700 hover:bg-gray-700/30"
                              >
                                {/* Metric Column */}
                                <td className="h-12 py-0.5 px-1 sm:px-2 md:px-2 lg:px-2 text-[14px] sm:text-[17px] md:text-[18px] lg:text-[19px] text-gray-200 font-bold">
                                  <div className="flex items-center justify-center h-full px-2">
                                    <span className="line-clamp-2">
                                      {comparison.label}
                                    </span>
                                  </div>
                                </td>

                                {/* Value columns */}
                                {wholeData?.labels?.map((label, labelIndex) => {
                                  if (label === "Current Investment") return null;
                                  const valueKey = `value${labelIndex + 1}`;
                                  const rawValue = comparison[valueKey];
                                  return (
                                    <td
                                      key={labelIndex}
                                      className={`h-12 py-0.5 px-1 sm:px-1 md:px-2 lg:px-2 text-[14px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-bold border-l border-gray-700 ${labelIndex === 1 ? "text-red-500" : "text-green-600"
                                        }`}
                                    >
                                      <div className="flex items-center justify-center h-full">
                                        {typeof rawValue === "number"
                                          ? rawValue.toFixed(2)
                                          : rawValue ?? "-"}
                                      </div>
                                    </td>
                                  );
                                })}
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    </Card>
                  </div>
                </div>

                <div className="w-full lg:w-[70%] h-[70vh] lg:h-full">
                  <div className="h-full bg-gray-600/20 rounded-lg overflow-hidden">
                    <Card className="h-full">
                      <div className="h-full">
                        {/* Increased to 99% to avoid overflow */}
                        <ResponsiveContainer width="99%" height="99%">
                          <AreaChart
                            data={wholeData?.comparePerformance?.slice(1)}
                            margin={{ top: 0, right: 5, left: 0, bottom: 40 }}
                          >
                            <CartesianGrid stroke="hsl(var(--muted-foreground) / 0)" />
                            {/* X-Axis with improved label positioning */}
                            <XAxis
                              dataKey="name"
                              type="category"
                              padding={{ left: 0, right: 0 }}
                              stroke="hsl(var(--muted-foreground))"
                              tickFormatter={(value) => {
                                const jsDate = new Date(
                                  (value - 25569) * 86400 * 1000
                                );
                                return jsDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "2-digit",
                                });
                              }}
                              tick={{
                                fontSize: 11, // Reduced font size
                                textAnchor: "end",
                                fill: "#ccc",
                                dy: 8
                              }}
                              height={40} // Added height for X-axis
                              tickMargin={10} // Increased margin to push labels down
                              angle={-45} // Added direct angle prop
                            />
                            <YAxis
                              type="number"
                              domain={["auto", "auto"]}
                              allowDataOverflow={false}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fontWeight: 300, fill: "#ccc" }}
                              tickMargin={2}
                              width={35}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "2px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                fontSize: "11px",
                              }}
                              labelFormatter={(label) => {
                                const serial = Number(label);
                                if (!isNaN(serial)) {
                                  const jsDate = new Date(
                                    (serial - 25569) * 86400 * 1000
                                  );
                                  return jsDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "2-digit",
                                  });
                                }
                                return label;
                              }}
                              formatter={(value: number) => {
                                return typeof value === "number"
                                  ? value.toFixed(2)
                                  : value;
                              }}
                            />
                            <YAxis
                              type="number"
                              yAxisId="right"
                              orientation="right"
                              domain={["auto", "auto"]}
                              allowDataOverflow={true}
                              width={0} // Reduced width on right side
                              tick={false} // Hide tick labels on right axis for cleaner look
                            />
                            <Legend
                              wrapperStyle={{
                                paddingTop: "5px",
                                fontSize: "11px",
                                marginBottom: "-20px"
                              }}
                            />
                            <defs>
                              <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(0, 80%, 60%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(0, 80%, 60%)" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="value1"
                              name={wholeData?.labels?.[0] ?? "Value 1"}
                              stroke="hsl(210, 100%, 56%)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              fill="url(#gradient1)"
                            />
                            <Area
                              type="monotone"
                              dataKey="value2"
                              name={wholeData?.labels?.[1] ?? "Value 2"}
                              stroke="hsl(0, 80%, 60%)"
                              strokeWidth={2}
                              fill="url(#gradient2)"
                            />
                            <Area
                              type="monotone"
                              dataKey="value3"
                              name={wholeData?.labels?.[2] ?? "Value 3"}
                              stroke="#16a34a"
                              strokeWidth={2}
                              fill="url(#gradient3)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <div className="text-center">
          {!showHiddenData && (
            <Button
              onClick={() => setShowHiddenData(true)}
              className="bg-trading-primary hover:bg-trading-primary text-white px-4  rounded-lg mb-5"
            >
              Show Stats and Graph
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
