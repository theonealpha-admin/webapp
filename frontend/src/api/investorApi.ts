import { axiosInstance } from '@/lib/axios';

interface InvestorData {
  fullName: string;
  panNumber: string;
  email: string;
  mobileNumber: string;
  address: string;
  alignmentConfirm: boolean;
  readyToProceed: boolean;
  acknowledgeTimelines: boolean;
}

export const submitSeedPartnerData = async (data: InvestorData) => {
  try {
    // Remove the /api/v1 prefix since it's already in the base URL
    const response = await axiosInstance.post('/investor/submit', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting seed partner data:', error);
    throw error;
  }
};