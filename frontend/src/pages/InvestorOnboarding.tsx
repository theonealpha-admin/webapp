import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { submitSeedPartnerData } from '@/api/investorApi';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const InvestorOnboarding = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  const [errors, setErrors] = useState({
    fullName: '',
    panNumber: '',
    email: '',
    mobileNumber: '',
    address: '',
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePAN = (pan) => {
    // PAN format: 5 letters, 4 numbers, 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  const validateMobile = (mobile) => {
    // Indian mobile number: 10 digits, may start with +91 or 0
    const mobileRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateFullName = (name) => {
    // At least 2 words, each at least 2 characters long, letters and spaces only
    const nameRegex = /^[A-Za-z]{2,}(?:\s[A-Za-z]{2,})+$/;
    return nameRegex.test(name);
  };

  const validateAddress = (address) => {
    // At least 10 characters long, containing numbers and letters
    return address.length >= 10 && /^[a-zA-Z0-9\s,.-]+$/.test(address);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));

    // Real-time validation
    let errorMessage = '';
    switch (name) {
      case 'fullName':
        if (value && !validateFullName(value)) {
          errorMessage = 'Please enter your full name (first & last name)';
        }
        break;
      case 'panNumber':
        if (value && !validatePAN(value)) {
          errorMessage = 'Invalid PAN format (e.g. ABCDE1234F)';
        }
        break;
      case 'email':
        if (value && !validateEmail(value)) {
          errorMessage = 'Invalid email format';
        }
        break;
      case 'mobileNumber':
        if (value && !validateMobile(value)) {
          errorMessage = 'Invalid mobile number (10 digits, may start with +91)';
        }
        break;
      case 'address':
        if (value && !validateAddress(value)) {
          errorMessage = 'Address must be at least 10 characters with valid characters only';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.alignmentConfirm && formData.readyToProceed && formData.acknowledgeTimelines;
    } else if (step === 2) {
      return formData.fullName && formData.panNumber && formData.email && formData.mobileNumber && formData.address &&
        !errors.fullName && !errors.panNumber && !errors.email && !errors.mobileNumber && !errors.address;
    }
    return true;
  };

  const validateFormData = () => {
    const newErrors = {
      fullName: '',
      panNumber: '',
      email: '',
      mobileNumber: '',
      address: '',
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (!validateFullName(formData.fullName)) {
      newErrors.fullName = 'Please enter your full name (first & last name)';
      isValid = false;
    }

    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN number is required';
      isValid = false;
    } else if (!validatePAN(formData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
      isValid = false;
    } else if (!validateMobile(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number (10 digits, may start with +91)';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    } else if (!validateAddress(formData.address)) {
      newErrors.address = 'Address must be at least 10 characters with valid characters only';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await submitSeedPartnerData(formData);
      setStep(4);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      let errorMessage = 'There was an error submitting your data. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for error message
  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
        <AlertCircle className="h-3 w-3" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-trading-background text-white">
      <Navigation />
      <main className="container mx-auto px-1 pt-28 pb-12">
        {step !== 4 && (
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-trading-primary mb-2">Seeders Onboarding Protocol </h1>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-black/30 p-4 rounded-lg border border-white/10">
              <h2 className="text-3xl text-trading-primary mb-3 font-bold">Greetings!!</h2>
              <p className="text-gray-300 text-xl">
                In line with our verbal discussions, you've been cordially invited to the <b>Genesis Series – Pool #001.</b>
              </p>
              <ul className="list-disc pl-4 mt-3 space-y-3 text-xl text-gray-300">
                <li>This pool is limited to <b>4 founding partners</b>, securing a unique, <b>first-mover advantage</b>.</li>
                <li>Below are the <b>essentials</b>, that <b>define Pool #001</b>, followed by a <b>confirmation section</b> to ensure alignment of understanding and intent to secure a seat in the pool.</li>
              </ul>
            </div>

            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h2 className="text-3xl text-trading-primary font-bold mb-4">Structure Recap</h2>
              
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-2xl text-trading-primary font-bold mb-3">Pool Overview</h3>
                  <ul className="space-y-2 text-gray-300 text-xl">
                    <li className="flex items-start gap-2">
                      <span className="text-trading-primary">○</span>
                      <span><b>Total Pool Size:</b> ₹1 crore</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-trading-primary">○</span>
                      <span><b>Institutional Funding:</b> ₹80 lakh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-trading-primary">○</span>
                      <span><b>Seed Fund:</b> ₹20 lakh (₹5 lakh per seeder)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-2xl text-trading-primary font-bold mb-3">Total Spots</h3>
                  <ul className="space-y-2 text-gray-300 text-xl">
                    <li className="flex items-start gap-2">
                      <span className="text-trading-primary">○</span>
                      <span><b>Seeders Limit: </b>4</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-trading-primary">○</span>
                      <span><b>Spots Left:</b> 2</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-2xl text-trading-primary font-bold mb-3">Return Expectation</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2 text-xl">
                      <span className="text-trading-primary">○</span>
                      <span><b>Lock-in Period:</b> 24 months</span>
                    </li>
                    <li className="flex items-start gap-2 text-xl">
                      <span className="text-trading-primary">○</span>
                      <span><b>Expected Return</b>: 1.7x after all expenses on your investment.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-2xl text-trading-primary font-bold mb-3">Performance Tracking</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2 text-xl">
                      <span className="text-trading-primary">○</span>
                      <span>Quarterly updates via a web app at <b>www.theonealpha.com</b></span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-2xl text-trading-primary font-bold mb-3">Date Of Commencement</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2 text-xl">
                      <span className="text-trading-primary">○</span>
                      <span><b>25th March 2025</b></span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-2xl text-trading-primary font-bold mb-3">The Goal</h3>
                  <p className="text-gray-300 text-xl">
                    To achieve <b>independent returns</b> by conducting a <b>MARKET NEUTRAL Arbitrage Strategy</b>, to beat the mutual funds in terms of both returns and downside volatility.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-lg border border-white/10">
              <h3 className="text-2xl text-trading-primary font-bold mb-3">Confirmation of Alignment</h3>
              <div className="space-y-3 pl-1">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="alignmentConfirm"
                    checked={formData.alignmentConfirm}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span className="text-gray-300 font-medium text-lg">
                    I have reviewed and understood the structure and terms of Pool #001.
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="readyToProceed"
                    checked={formData.readyToProceed}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span className="text-gray-300 font-medium text-lg">
                    I confirm my interest and readiness to proceed as one of the 4 Seed Partners.
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="acknowledgeTimelines"
                    checked={formData.acknowledgeTimelines}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span className="text-gray-300 font-medium text-lg">
                    I acknowledge the timelines, commitments, and returns outlined above.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleNext}
                disabled={!validateStep()}
                className="bg-trading-primary hover:bg-trading-primary/80 text-white px-8 py-5 text-lg"
                size="lg"
              >
                Proceed to Compliance
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <Card className="max-w-3xl mx-auto bg-gray-900/70 border border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-400 ">
                Provide your details to secure your seat in - 
                <strong className="text-center text-trading-primary"> Genesis Series-Pool #001</strong>
              </CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block mb-2 text-gray-400 font-bold text-lg">Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full mb-1 p-3 bg-black/60 border border-white/20 rounded text-white text-lg"
                    placeholder="Your full legal name"
                    required
                  />
                  <ErrorMessage message={errors.fullName} />
                </div>

                <div>
                  <label className="block mb-2 text-gray-400 font-bold">PAN Number*</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    className={`w-full mb-1 p-3 bg-black/60 border ${errors.panNumber ? 'border-red-500' : 'border-white/20'} rounded text-white`}
                    placeholder="10-character PAN (e.g. ABCDE1234F)"
                    required
                  />
                  <ErrorMessage message={errors.panNumber} />
                </div>

                <div>
                  <label className="block mb-2 text-gray-400 font-bold">Email ID*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full mb-1 p-3 bg-black/60 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded text-white`}
                    placeholder="Your email address"
                    required
                  />
                  <ErrorMessage message={errors.email} />
                </div>

                <div>
                  <label className="block mb-2 text-gray-400 font-bold">Mobile Number*</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`w-full mb-1 p-3 bg-black/60 border ${errors.mobileNumber ? 'border-red-500' : 'border-white/20'} rounded text-white`}
                    placeholder="10-digit mobile number"
                    required
                  />
                  <ErrorMessage message={errors.mobileNumber} />
                </div>

                <div>
                  <label className="block mb-2 text-gray-400 font-bold">Full Address*</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full mb-1 p-3 bg-black/60 border ${errors.address ? 'border-red-500' : 'border-white/20'} rounded text-white`}
                    placeholder="Your complete residential address"
                    rows={3}
                    required
                  />
                  <ErrorMessage message={errors.address} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between flex-wrap gap-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="border-white/20 text-gray-300 hover:bg-gray-800 text-lg"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!validateStep()}
                className="bg-trading-primary hover:bg-trading-primary/80 text-white px-4 text-lg"
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
              <CardTitle className="text-2xl text-trading-primary"><b>Review & Submit</b></CardTitle>
              <CardDescription className="text-gray-300 text-xl mt-2">
              <b>Please review the information carefully before submitting</b>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-lg">
                    <div>
                      <p className="font-medium text-trading-primary "><b>Name:</b></p>
                      <p>{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-trading-primary"><b>PAN Number:</b></p>
                      <p>{formData.panNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium text-trading-primary"><b>Email:</b></p>
                      <p>{formData.email}</p>
                    </div>
                    <div>
                      <p className="font-medium text-trading-primary"><b>Mobile:</b></p>
                      <p>{formData.mobileNumber}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-medium text-trading-primary"><b>Address:</b></p>
                      <p>{formData.address}</p>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
            <CardFooter className="justify-between flex-wrap gap-4">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="border-white/20 text-gray-300 hover:bg-gray-800 text-m px-4 text-lg"
                size="lg"
              >
                Edit Details
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-trading-primary hover:bg-trading-primary/80 text-white px-4 text-lg"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Secure My Seat"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <div className="container mx-auto px-1 pt-4 pb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mb-2"
            >
              <Check className="h-10 w-10 text-green-500" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-trading-primary text-center">Your Application Has Been Submitted</h2>
              
              <div className="bg-black/30 p-2 rounded-lg border border-white/10 text-left">
                <p className="text-gray-200 text-xl mb-4">
                  Our team will guide you through each step
                </p>
                
                <h3 className="text-xl font-bold text-trading-primary mb-3">What Happens Next?</h3>
                <ol className="space-y-2 text-gray-200">
                  <li className="flex items-center justify-between p-2 rounded">
                    <span className="text-lg"><b>Compliance Review</b></span>
                    <span className="text-gray-400 italic">March 17, 2025</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded">
                    <span className="text-lg"><b>Seed Pool Finalization</b></span>
                    <span className="text-gray-400 italic">March 19, 2025</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded">
                    <span className="text-lg"><b>Prime Lender Approval</b></span>
                    <span className="text-gray-400 italic">March 20, 2025</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded">
                    <span className="text-lg"><b>Terminal Setup</b></span>
                    <span className="text-gray-400 italic">March 21, 2025</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded">
                    <span className="text-lg"><b>Capital Deployment</b></span>
                    <span className="text-gray-400 italic">March 21, 2025</span>
                  </li>
                  <li className="flex items-center justify-between p-2 bg-green-950/30 rounded border border-green-900/50">
                    <span className="text-lg text-green-500"><b>Operations Begin</b></span>
                    <span className="text-gray-400 italic">March 25, 2025</span>
                  </li>
                </ol>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-gray-200">
                    We'll keep you updated. Questions? <a href="mailto:enquiries@theonealpha.com" className="text-trading-primary hover:underline">Enquiries@theonealpha.com</a>
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-trading-primary hover:bg-trading-primary/80 text-white px-8 py-4 text-lg"
                  size="lg"
                >
                  Return to Home
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InvestorOnboarding;