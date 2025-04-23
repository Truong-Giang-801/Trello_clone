import { auth } from '@/config/auth.config';
import DashboardFooter from '@/modules/dashboard/layout/DashboardFooter';
import DashboardHeader from '@/modules/dashboard/layout/DashboardHeader';
import DashboardSider from '@/modules/dashboard/layout/DashboardSider';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'GCheck Dashboard',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  return (
    <SessionProvider session={session}>
      <Layout
        style={{
          flexDirection: 'row',
        }}
      >
        <DashboardSider session={session} />
        <Layout>
          <DashboardHeader />
          <Content style={{ padding: '16px 32px', minHeight: '100vh' }}>
            {children}
          </Content>
          <DashboardFooter />
        </Layout>
      </Layout>
    </SessionProvider>
  );
}
