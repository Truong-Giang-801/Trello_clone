'use client';
import { Typography } from 'antd';
import { Footer } from 'antd/es/layout/layout';

const { Text } = Typography;

export default function DashboardFooter() {
  return (
    <Footer style={{ textAlign: 'center', paddingTop: 0, paddingBottom: 16 }}>
      <Text type='secondary' style={{ fontSize: 12 }}>
        GCheck ©{new Date().getFullYear()}
      </Text>
    </Footer>
  );
}
