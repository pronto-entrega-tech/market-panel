import { useState } from "react";
import { Page } from "~/constants/pages";

export const useConfigState = () => {
  const [path, setPath] = useState<string>(Page.Profile);

  return { path, setPath };
};
