import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import ClientProviders from './ClientProviders';

export const metadata: Metadata = {
  title: 'Serviços Municipais - Prefeitura do Rio de Janeiro',
  description: 'Plataforma de Solicitação de Serviços Municipais da Prefeitura do Rio de Janeiro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="bg-blue-600 text-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl flex items-center">
              <span className="mr-2">🏙️</span> Serviços Municipais
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-blue-200 transition">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/solicitacoes/nova" className="hover:text-blue-200 transition">
                    Nova Solicitação
                  </Link>
                </li>
                <li>
                  <Link href="/mapa" className="hover:text-blue-200 transition">
                    Mapa
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <ClientProviders>{children}</ClientProviders>
        </main>
        
        <footer className="bg-gray-100 border-t">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Prefeitura do Rio de Janeiro. Todos os direitos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
