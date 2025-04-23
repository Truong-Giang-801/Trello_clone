"use client";
import themeConfig from "@/config/theme.config";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Entity from "@ant-design/cssinjs/lib/Cache";
import { ConfigProvider } from "antd";
import { useServerInsertedHTML } from "next/navigation";
import { useMemo } from "react";

export default function AppConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = useMemo<Entity>(() => createCache(), []);
  const render = (
    <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
  );

  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `</script>${extractStyle(cache)}<script>`,
        }}
      />
    );
  });

  if (typeof window !== "undefined") {
    return render;
  }

  return <StyleProvider cache={cache}>{render}</StyleProvider>;
}
