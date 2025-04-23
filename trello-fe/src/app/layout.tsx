import ConfigProvider from "@/common/providers/ConfigProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";

import { App } from "antd";
import "./styles.css";

export const metadata: Metadata = {
  title: "Trello",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <AntdRegistry>
          <ConfigProvider>
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
