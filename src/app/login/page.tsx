import type { ReactElement } from "react";

import { LoginPage } from "@/views/login";

export const dynamic = "force-static";

export default function Page(): ReactElement {
  return LoginPage();
}
