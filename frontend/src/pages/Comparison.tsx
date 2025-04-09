import BackButton from "@/components/BackButton";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { AUTH_TOKEN } from "@/constants/auth";
import { useNavigate } from "react-router-dom";

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
}

interface FinancialData {
  stats: Data[];
  compareStats: CompareData[];
  performance: GraphData[];
  comparePerformance: GraphData;
  labels: string[];
  comparisonSummary: string;
}

const Comparison = () => {
  const navigate = useNavigate();

  const { toast } = useToast();
  const [wholeData, setWholeData] = useState<FinancialData>();

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
        description: "Failed to fetch data. Something went wrong!.",
        duration: 2500,
      });
      console.log(`error while fetching data ${error}`);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex  items-baseline gap-5">
            <BackButton />
            <h1 className="text-3xl sm:text-3xl font-bold mb-4 md:mb-8 font-funneln ">
              Strategy Comparison
            </h1>
          </div>
          <h1 className="text-2xl font-bold  font-funnel mt-2">Summary</h1>
          {/* Summary Text */}
          <p className="text-lg text-gray-300 font-funnel mb-8">
            {wholeData?.comparisonSummary}
          </p>

          <div className="grid grid-cols-3 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3 gap-4 p-1">
            {wholeData?.compareStats?.map((comparison) => (
              <Card key={comparison.label} className="glass-card">
                <CardContent className="p-2 sm:p-6">
                  <p className="text-sm text-gray-400 font-funnel">
                    {comparison.label}
                  </p>
                  <div className="flex justify-between  mt-1 sm:mt-2">
                    <p className="text-lg sm:text-2xl font-bold text-trading-primary font-funnel">
                      {comparison?.value1}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-500 font-funnel">
                      {comparison?.value2}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="w-full mt-8 p-4 sm:p-6 mb-4 md:mb-8 bg-background/80 backdrop-blur-sm border-muted">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
              Performance Comparison
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={wholeData?.comparePerformance}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted-foreground) / 0.2)"
                    vertical={true}
                    horizontal={true}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value1"
                    name={wholeData?.labels[0]}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value2"
                    name={wholeData?.labels[1]}
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Comparison;
