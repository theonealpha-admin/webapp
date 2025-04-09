import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { submitSeedPartnerData } from '@/api/investorApi';
import { Check, Scale, Shield, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const InvestorOnboarding2 = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    panNumber: '',
    email: '',
    mobileNumber: '',
    address: '',
    alignmentConfirm: false,
    readyToProceed: false,
    acknowledgeTimelines: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.alignmentConfirm && formData.readyToProceed && formData.acknowledgeTimelines;
    } else if (step === 2) {
      return formData.fullName && formData.panNumber && formData.email && formData.mobileNumber && formData.address;
    }
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitSeedPartnerData(formData);
      setStep(4);
      window.scrollTo(0, 0);
      toast({
        title: 'Position Secured',
        description: 'Your application for Pool #001 has been submitted.',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your data. Please try again.',
        duration: 2500,
      });
    }
  };

  const TermCard = ({ icon: Icon, title, children }) => (
    <div className="bg-black/40 p-4 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-trading-primary" />
        <h3 className="text-lg text-trading-primary font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-trading-background text-white">
      <Navigation />
      <div className="min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4">
          <div className="w-[600px] max-w-full mx-auto pt-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-trading-primary mb-4 text-center">
              Genesis Pool #001
            </h1>
          </div>
        </div>

        <div className="min-h-[calc(100vh-64px)] pt-6">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3"
            >
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-trading-primary mb-4 text-center leading-tight">
                  Genesis Pool #001
                </h1>
              </div>
            </motion.div>

            {step === 1 && (
              <Card className="max-w-4xl mx-auto bg-gray-900/70 border border-white/10 backdrop-blur-sm">
                <CardHeader className="px-6 py-3">
                  <CardTitle className="text-2xl text-trading-primary">Structure Recap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 px-4 pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <TermCard icon={Scale} title="Investment Terms">
                      <ul className="space-y-0.5 text-base text-gray-100">
                        <li className="flex justify-between border-b border-white/10 py-0.5">
                          <span>Individual Investment:</span>
                          <strong className="text-trading-primary">₹5 Lakh</strong>
                        </li>
                        <li className="flex justify-between border-b border-white/10 py-0.5">
                          <span>Lock-in Period:</span>
                          <strong className="text-trading-primary">24 Months</strong>
                        </li>
                        <li className="flex justify-between py-0.5">
                          <span>Pool Activation:</span>
                          <strong className="text-trading-primary">March 25, 2025</strong>
                        </li>
                      </ul>
                    </TermCard>

                    <TermCard icon={Shield} title="Return Framework">
                      <ul className="space-y-0.5 text-base text-gray-100">
                        <li className="flex justify-between border-b border-white/10 py-0.5">
                          <span>Base Return (p.a.):</span>
                          <strong className="text-trading-primary">10%</strong>
                        </li>
                        <li className="flex justify-between border-b border-white/10 py-0.5">
                          <span>Excess Return:</span>
                          <strong className="text-trading-primary">1.7x-1.9x</strong>
                        </li>
                        <li className="flex justify-between py-0.5">
                          <span>Performance Updates:</span>
                          <strong className="text-trading-primary">Quarterly</strong>
                        </li>
                      </ul>
                    </TermCard>

                    <TermCard icon={Users} title="Capital Structure">
                      <ul className="space-y-0.5 text-base text-gray-100">
                        <li className="flex justify-between border-b border-white/10 py-0.5">
                          <span>Seed Partner Spots:</span>
                          <strong className="text-trading-primary">4 Only</strong>
                        </li>
                        <li className="flex justify-between border-b border-white/10 py-0.5">
                          <span>Total Seed Capital:</span>
                          <strong className="text-trading-primary">₹20 Lakh</strong>
                        </li>
                        <li className="flex justify-between border-b border-white/10 py-0.5">
                          <span>Base Capital:</span>
                          <strong className="text-trading-primary">₹80 Lakh</strong>
                        </li>
                        <li className="flex justify-between py-0.5">
                          <span>Total Pool Size:</span>
                          <strong className="text-trading-primary">₹1 Crore</strong>
                        </li>
                      </ul>
                    </TermCard>

                    <TermCard icon={Clock} title="Key Pointers">
                      <ul className="space-y-0.5 text-base text-gray-100">
                        <li className="flex items-center gap-2 border-b border-white/10 py-0.5">
                          <Check className="w-4 h-4 text-trading-primary flex-shrink-0" />
                          <span>Market Neutral Arbitrage Strategy to achieve uncorrelated returns.</span>
                        </li>
                        <li className="flex items-center gap-2 py-0.5">
                          <Check className="w-4 h-4 text-trading-primary flex-shrink-0" />
                          <span>Secure Web Portal Access to track performance.</span>
                        </li>
                      </ul>
                    </TermCard>
                  </div>

                  <div className="mt-4 space-y-2 bg-black/40 p-4 rounded-lg border border-white/10">
                    <h3 className="text-xl text-trading-primary font-bold mb-2">Acknowledgment</h3>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 p-2 bg-black/60 rounded-lg border border-white/10 transition-colors hover:border-trading-primary">
                        <input
                          type="checkbox"
                          name="alignmentConfirm"
                          checked={formData.alignmentConfirm}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span className="text-gray-300 font-bold">
                          I have reviewed and accept all terms and conditions outlined above.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 p-2 bg-black/60 rounded-lg border border-white/10 transition-colors hover:border-trading-primary">
                        <input
                          type="checkbox"
                          name="readyToProceed"
                          checked={formData.readyToProceed}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span className="text-gray-300 font-bold">
                          I confirm my intent to proceed as one of four founding partners.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 p-2 bg-black/60 rounded-lg border border-white/10 transition-colors hover:border-trading-primary">
                        <input
                          type="checkbox"
                          name="acknowledgeTimelines"
                          checked={formData.acknowledgeTimelines}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span className="text-gray-300 font-bold">
                          I acknowledge all commitments, timelines, and obligations.
                        </span>
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-center pt-2">
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className="bg-trading-primary hover:bg-trading-primary/80 text-white px-8 py-5 text-lg"
                    size="lg"
                  >
                    Proceed to Compliance
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card className="max-w-3xl mx-auto bg-gray-900/70 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-trading-primary">Partner Documentation</CardTitle>
                  <CardDescription className="text-gray-300 text-lg mt-2">
                    Required information for formal agreement and compliance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-gray-300">Full Legal Name*</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-3 bg-black/60 border border-white/20 rounded text-white focus:border-trading-primary transition-colors"
                        placeholder="As per PAN card"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-300">PAN Number*</label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        className="w-full p-3 bg-black/60 border border-white/20 rounded text-white focus:border-trading-primary transition-colors"
                        placeholder="10-digit PAN"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-300">Email Address*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-black/60 border border-white/20 rounded text-white focus:border-trading-primary transition-colors"
                        placeholder="For official communications"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-300">Contact Number*</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full p-3 bg-black/60 border border-white/20 rounded text-white focus:border-trading-primary transition-colors"
                        placeholder="Primary contact"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-gray-300">Registered Address*</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 bg-black/60 border border-white/20 rounded text-white focus:border-trading-primary transition-colors"
                        placeholder="Complete postal address"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between flex-wrap gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-white/20 text-gray-300 hover:bg-gray-800"
                  >
                    Review Terms
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className="bg-trading-primary hover:bg-trading-primary/80 text-white px-8"
                    size="lg"
                  >
                    Submit Details
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card className="max-w-3xl mx-auto bg-gray-900/70 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-trading-primary">Final Review</CardTitle>
                  <CardDescription className="text-gray-300 text-lg mt-2">
                    Verify all information before confirmation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-black/30 p-6 rounded-lg border border-white/10"
                    >
                      <h3 className="text-xl text-trading-primary font-bold mb-4">Partner Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <div>
                          <p className="font-medium">Name:</p>
                          <p>{formData.fullName}</p>
                        </div>
                        <div>
                          <p className="font-medium">PAN Number:</p>
                          <p>{formData.panNumber}</p>
                        </div>
                        <div>
                          <p className="font-medium">Email:</p>
                          <p>{formData.email}</p>
                        </div>
                        <div>
                          <p className="font-medium">Contact:</p>
                          <p>{formData.mobileNumber}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="font-medium">Address:</p>
                          <p>{formData.address}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
                <CardFooter className="justify-center flex-wrap gap-4">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="border-white/20 text-gray-300 hover:bg-gray-800"
                  >
                    Edit Information
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-trading-primary hover:bg-trading-primary/80 text-white px-8"
                    size="lg"
                  >
                    Secure My Spot
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 4 && (
              <Card className="max-w-3xl mx-auto bg-gray-900/70 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-trading-primary">Agreement Confirmed</CardTitle>
                  <CardDescription className="text-gray-300 text-lg mt-2">
                    Welcome to Genesis Pool #001
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mb-6"
                  >
                    <Check className="h-10 w-10 text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-trading-primary mb-4">Next Steps</h2>
                  <div className="max-w-md mx-auto">
                    <ol className="space-y-4 text-left">
                      <li className="flex items-center gap-4">
                        <div className="bg-trading-primary/20 p-2 rounded-full">
                          <Check className="h-5 w-5 text-trading-primary" />
                        </div>
                        <span className="text-gray-300">Agreement documentation via email</span>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className="bg-trading-primary/20 p-2 rounded-full">
                          <Check className="h-5 w-5 text-trading-primary" />
                        </div>
                        <span className="text-gray-300">Compliance verification (48 hours)</span>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className="bg-trading-primary/20 p-2 rounded-full">
                          <Check className="h-5 w-5 text-trading-primary" />
                        </div>
                        <span className="text-gray-300">Final documentation process</span>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className="bg-trading-primary/20 p-2 rounded-full">
                          <Check className="h-5 w-5 text-trading-primary" />
                        </div>
                        <span className="text-gray-300">Commencement: March 25, 2025</span>
                      </li>
                    </ol>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-trading-primary hover:bg-trading-primary/80 text-white px-8"
                    size="lg"
                  >
                    Access Portal
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorOnboarding2;