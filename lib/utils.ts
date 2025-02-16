import { parse, differenceInYears } from "date-fns";

export const calculateAge = (dob: string): number => {
  try {
    const today = new Date();
    return differenceInYears(today, dob);
  } catch (error) {
    console.error("Error calculating age:", error);
    return 0;
  }
};
