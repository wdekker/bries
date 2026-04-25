import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* SEO Meta Tags */}
        <title>Nimbus - Weather Forecast</title>
        <meta name="description" content="A beautiful, high-performance, cross-platform weather application built with Expo and React Native." />
        <meta property="og:title" content="Nimbus - Weather Forecast" />
        <meta property="og:description" content="A beautiful, cross-platform weather application." />
        <meta property="og:url" content="https://nimbus.dekker.dev" />
        <meta property="og:type" content="website" />

        <ScrollViewStyleReset />

        {/* GoatCounter Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.goatcounter = {
                  path: function(p) { return '/nimbus' + (p || '/') }
              };
            `,
          }}
        />
        <script data-goatcounter="https://dekker-dev.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
