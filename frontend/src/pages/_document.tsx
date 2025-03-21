import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.ENV_BACKEND_URL = "${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://85a34aa98b710d.lhr.life'}";
            window.ENV_API_URL = "${process.env.NEXT_PUBLIC_API_URL || 'https://85a34aa98b710d.lhr.life/api'}";
            console.log("Environment variables loaded:", {
              ENV_BACKEND_URL: window.ENV_BACKEND_URL,
              ENV_API_URL: window.ENV_API_URL
            });
          `
        }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
