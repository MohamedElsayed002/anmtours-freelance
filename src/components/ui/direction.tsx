"use client";

import * as React from "react";
import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";

type Direction = "ltr" | "rtl";

type DirectionProviderProps = {
  direction?: Direction;
  children: React.ReactNode;
};

export function DirectionProvider({
  direction = "ltr",
  children,
}: DirectionProviderProps) {
  return <RadixDirectionProvider dir={direction}>{children}</RadixDirectionProvider>;
}
