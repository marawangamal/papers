// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "katex/dist/katex.min.css";
import "./styles.css";
import { Analytics } from "@vercel/analytics/react";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "@/config/theme";

export const metadata = {
  title: "Papers",
  description: "Find relevant papers for your research",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
          <Analytics />
        </MantineProvider>
      </body>
    </html>
  );
}
