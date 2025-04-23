'use client';

import { theme } from 'antd';
import { PropsWithChildren } from 'react';

export default function DashboardPageContainer({
  children,
}: PropsWithChildren) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div
      style={{
        padding: 24,
        minHeight: 768,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {children}
    </div>
  );
}
