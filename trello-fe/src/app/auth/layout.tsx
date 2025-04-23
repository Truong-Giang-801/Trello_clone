import ConfigProvider from "@/common/providers/ConfigProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { App } from "antd";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
