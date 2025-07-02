import { Chapa } from 'chapa-nodejs';
import dotenv from "dotenv";
import axios from 'axios';
import Owner from '../models/Owner.js';

dotenv.config();

// Function to fetch banks from Chapa API
const getBanks = async () => {
  try {
    const response = await axios.get('https://api.chapa.co/v1/banks', {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching banks:", error);
    return null;
  }
};

// Function to create subaccounts and fetch owner data
export const createSubaccount = async (req, res, next) => {
  try {
    const banks = await getBanks();

    if (!banks || !banks.data) {
      return res.status(404).json({ message: "No bank found" });
    }

    const ownerData = await Owner.find({})
      .populate({
        path: 'user',
        model: 'User',
      })
      .populate('bankAccounts')
      .exec();

    const responseData = {
      owners: ownerData.map(owner => ({
        id: owner._id,
        user: owner.user,
        bankAccounts: owner.bankAccounts,
      }))
    };

    console.log(responseData);
    return res.json({ ownerData: responseData });
  } catch (error) {
    console.error("Error in creatSubaccount:", error);
    next(error);
  }
};

// Function to create subaccounts using Chapa API
export const creatSubaccounts = async (req, res, next) => {
  try {
    const banks = await getBanks();

    if (!banks || !banks.data) {
      return res.status(404).json({ message: "No bank found" });
    }

    const ownerData = await Owner.find({})
      .populate({
        path: 'user',
        model: 'User',
      })
      .populate('bankAccounts')
      .exec();

    // Assuming you have subaccount data to send in the request body
    const { subaccountData } = req.body;

    const subaccount = await axios.post('https://api.chapa.co/v1/subaccount',
      subaccountData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        }
      });

    if (!subaccount || !subaccount.data) {
      return res.status(400).json({ message: "Failed to create subaccount" });
    }

    return res.json({ subaccount: subaccount.data });
  } catch (error) {
    console.error("Error in creatSubaccounts:", error);
    next(error);
  }
};

