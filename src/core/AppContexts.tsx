import React, { ReactElement } from "react";
import { ChatProvider } from "~/contexts/ChatContext";
import { StockEditProvider } from "~/contexts/StockEditContext";
import { MyProvider as CommonProvider } from "./context";

export const AppContexts = ({ children }: { children: ReactElement }) =>
  nestComponents(children, [CommonProvider, ChatProvider, StockEditProvider]);

const nestComponents = (
  children: ReactElement,
  components: React.FC<{ children: ReactElement }>[],
) =>
  components.reduceRight(
    (previous, Component) => <Component>{previous}</Component>,
    children,
  );
