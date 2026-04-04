import type { ReactElement } from "react";

import { LoginPage } from "@/views/login";

export default function Page(): Promise<ReactElement> {
  return LoginPage();
}
