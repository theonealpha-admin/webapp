import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, TrendingUp, Brain, Code, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const features = [
  {
    title: 'Advanced Analytics',
    description: 'Leverage machine learning algorithms for predictive market analysis',
    icon: <Brain className="w-6 h-6 text-trading-primary" />,
  },
  {
    title: 'Algorithmic Trading',
    description: 'Execute trades automatically with sophisticated algorithms',
    icon: <Code className="w-6 h-6 text-trading-primary" />,
  },
  {
    title: 'Real-time Processing',
    description: 'Process market data in real-time with high-performance computing',
    icon: <Cpu className="w-6 h-6 text-trading-primary" />,
  },
];

const Home2 = () => {
  return (
    <div className="min-h-screen bg-trading-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-funnel bg-gradient-to-r from-trading-primary to-blue-500 text-transparent bg-clip-text">
              Quantitative Trading Evolution
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-funnel">
              Where Advanced Mathematics Meets Financial Markets
            </p>
            <Button className="bg-trading-primary hover:bg-trading-secondary text-white px-8 py-6 rounded-lg text-lg font-funnel">
              Start Trading <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <Card key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 font-funnel">{feature.title}</h3>
                <p className="text-gray-300 font-funnel">{feature.description}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Performance Chart Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6 font-funnel">Performance Analytics</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" fontFamily="Funnel Display" />
                    <YAxis stroke="#666" fontFamily="Funnel Display" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A1A1A",
                        border: "1px solid #333",
                        fontFamily: "Funnel Display",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: "#10B981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 font-funnel">Ready to Start Trading?</h2>
            <p className="text-xl text-gray-300 mb-8 font-funnel">
              Join our platform and experience the future of quantitative trading
            </p>
            <Link to="/login">
              <Button className="bg-trading-primary hover:bg-trading-secondary text-white px-8 py-6 rounded-lg text-lg font-funnel">
                Get Started Now <TrendingUp className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home2;