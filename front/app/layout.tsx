import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

import { config } from '../wagmi';
import { Providers } from './providers';

import './globals.css';
import { Inter, Amiri, Poppins } from 'next/font/google';
import Navbar from '../components/navbar';

export const metadata = {
  metadataBase: new URL('https://postgres-prisma.vercel.app'),
  title: 'Propytech',
  description: 'Rental properties onchain',
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const amiri = Amiri({
  variable: '--font-amiri',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config, headers().get('cookie'));
  return (
    <html lang="en">
      {/* TODO: adicionar o conector de carteira no topo, usando wagmi */}
      {/* TODO: adicionar uma tela de perfil, com o set de algumas informações*/}
      {/* TODO: fazer a rota de API onde o usuário cria usa conta (o ideal seria com um auth da google por exemplo,
        mas podemos fazer uma autenticação simples primeiro com registro e login normal e fica de fallback)
      ) */}
      {/* TODO: fazer os detalhes na tela de rent individual em /rentals/[rentalId]/page */}
      {/* TODO: colocar os botões que vão chamar as funções de rent() e checkIn() */}
      <body
        className={`${inter.variable} ${amiri.variable} ${poppins.variable}`}
      >
        <Navbar></Navbar>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
