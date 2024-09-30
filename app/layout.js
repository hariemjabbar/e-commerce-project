import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Header from './components/Header/Header';
import './globals.css';

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Header session={session} />
        <main>{children}</main>
      </body>
    </html>
  );
}
