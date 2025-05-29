import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import type { AppProps } from "next/app"; // Import Next.js types

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <Component {...pageProps} />
    </MantineProvider>
  );
}