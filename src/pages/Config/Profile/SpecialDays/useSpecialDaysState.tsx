import { useState } from "react";
import { useProfileState } from "../useProfileState";

export const useSpecialDaysState = ({
  profile,
  setProfile,
}: ReturnType<typeof useProfileState>) => {
  const [specialDays, setSpecialDays] = useState(profile?.special_days ?? []);

  return { specialDays, setSpecialDays, setProfile };
};
