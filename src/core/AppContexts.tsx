import React from "react";
import { ChatProvider } from "~/contexts/ChatContext";
import { StockEditProvider } from "~/contexts/StockEditContext";
import { MyProvider as CommonProvider } from "./context";

export const AppContexts = ({ children }: any) =>
  nestComponents(children, [CommonProvider, ChatProvider, StockEditProvider]);

const nestComponents = (children: JSX.Element, components: React.FC<any>[]) =>
  components.reduceRight(
    (previous, Component) => <Component>{previous}</Component>,
    children,
  );
