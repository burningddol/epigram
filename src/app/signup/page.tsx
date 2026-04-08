import type { ReactElement } from "react";

import { SignUpPage } from "@/views/signup";

export const dynamic = "force-static";

export default function Page(): ReactElement {
  return SignUpPage();
}
