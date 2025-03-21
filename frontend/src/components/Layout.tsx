import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title = 'Serviços Municipais' }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title} | Prefeitura do Rio de Janeiro</title>
        <meta name="description" content="Plataforma de Solicitação de Serviços Municipais da Prefeitura do Rio de Janeiro" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
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
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Prefeitura do Rio de Janeiro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
