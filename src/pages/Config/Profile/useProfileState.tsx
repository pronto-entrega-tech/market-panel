import { useState, useEffect } from "react";
import useMyContext from "~/core/context";
import { ProfileType } from "~/core/types";
import { useError } from "~/hooks/useError";
import { api } from "~/services/api";

export const useProfileState = () => {
  const { socket } = useMyContext();
  const [hasError, setError, tryAgain] = useError();
  const [profile, setProfile] = useState<ProfileType>();

  useEffect(() => {
    if (!socket || hasError) return;

    api.markets.find().then(setProfile).catch(setError);
  }, [socket, hasError, setError]);

  return { profile, setProfile, hasError, tryAgain };
};
