import type { ReactElement } from "react";

import { SignUpPage } from "@/views/signup";

export default function Page(): Promise<ReactElement> {
  return SignUpPage();
}
