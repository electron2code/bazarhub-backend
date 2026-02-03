import axios from "axios";
import { prisma } from "../db/db.ts";
import { ApiError } from "../utils/apiError.ts";

const FLEXPAY_BASE_URL = "https://pay.flexpaybd.com/api/payment";


export const createFlexPayPayment = async (payload: {
  cus_name: string;
  cus_email: string;
  amount: number;
  success_url: string;
  cancel_url: string;
  meta_data?: any;
}) => {
  let data = JSON.stringify({ 
    "success_url": payload.success_url, 
    "cancel_url": payload.cancel_url, 
    "metadata": payload.meta_data, 
    "amount": payload.amount 
  });

  const paymentGateway = await prisma.paymentGateway.findUnique({
    where: {
      name: "flexpay",
    },
    include: {
      config: true,
    }
  });

  if (!paymentGateway) {
    throw new ApiError(400, "Invalid api key");
  }

  const apiKey = paymentGateway?.config?.api_key;

  if (!apiKey) {
    throw new ApiError(400, "Invalid api key");
  }

  console.log(apiKey);

  let config = { 
    method: 'post', 
    maxBodyLength: Infinity, 
    url: `${FLEXPAY_BASE_URL}/create`, 
    headers: { 
      'API-KEY': apiKey || process.env.FLEXPAY_BRAND_KEY!,
      'Content-Type': 'application/json',
    }, 
    data : data 
  };

  const res = await axios(config)
  return res.data;
};

export const verifyFlexPayPayment = async (transactionId: string) => {
  const paymentGateway = await prisma.paymentGateway.findUnique({
    where: {
      name: "flexpay",
    },
    include: {
      config: true,
    }
  });

  if (!paymentGateway) {
    throw new ApiError(400, "Invalid api key");
  }

  const apiKey = paymentGateway?.config?.api_key;
  let data = JSON.stringify({ "transaction_id": transactionId});
  let config = { 
    method: 'post', 
    maxBodyLength: Infinity, 
    url: `${FLEXPAY_BASE_URL}/verify`, 
    headers: { 
      'API-KEY': apiKey || process.env.FLEXPAY_BRAND_KEY!, 
      'Content-Type': 'application/json', 
    }, 
    data : data
  };

  const res = await axios(config);
  return res.data;
};