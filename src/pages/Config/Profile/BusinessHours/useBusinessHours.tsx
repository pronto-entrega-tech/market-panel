import { useState, useEffect } from "react";
import { useProfileState } from "../useProfileState";

export const useBusinessHours = ({
  profile,
  setProfile,
}: ReturnType<typeof useProfileState>) => {
  const [businessHours, setBusinessHours] = useState(
    profile?.business_hours ?? [],
  );

  useEffect(() => {
    setBusinessHours((v) =>
      profile && !v.length ? profile.business_hours : v,
    );
  }, [profile]);

  return { businessHours, setBusinessHours, setProfile };
};
