'use client';
import {
  ROUTE_DASHBOARD,
  ROUTE_DASHBOARD_BUSINESSES,
  ROUTE_DASHBOARD_PRODUCTS,
  ROUTE_DASHBOARD_STAMP_BATCHES,
  ROUTE_DASHBOARD_STAMP_REQUESTS,
  ROUTE_DASHBOARD_STAMPS,
  ROUTE_DASHBOARD_TRACEABILITY,
  ROUTE_DASHBOARD_USERS,
} from '@/app/dashboard/routes';
import GcheckLogo from '@/common/components/GcheckLogo';
import { UserRole } from '@/modules/user/enums/user-role';
import { UserHelper } from '@/modules/user/helpers/user.helper';
import {
  CheckOutlined,
  DashboardOutlined,
  MenuOutlined,
  PartitionOutlined,
  PicCenterOutlined,
  ProductOutlined,
  SafetyCertificateOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Flex, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  session?: Session | null;
};

export default function DashboardSider({ session }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  const menuItems = useMemo(() => {
    const items: ItemType<MenuItemType>[] = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => router.push(ROUTE_DASHBOARD),
      },
      {
        key: 'businesses',
        icon: <UnorderedListOutlined />,
        label: 'Doanh nghiệp',
        onClick: () => router.push(ROUTE_DASHBOARD_BUSINESSES),
      },
      {
        key: 'products',
        icon: <ProductOutlined />,
        label: 'Sản phẩm',
        onClick: () => router.push(ROUTE_DASHBOARD_PRODUCTS),
      },
      {
        key: 'traceability',
        icon: <PartitionOutlined />,
        label: 'Truy xuất',
        onClick: () => router.push(ROUTE_DASHBOARD_TRACEABILITY),
      },
    ];

    if (
      UserHelper.isSuperAdmin(session?.user.role as UserRole) ||
      UserHelper.isAdmin(session?.user.role as UserRole)
    ) {
      items.splice(1, 0, {
        key: 'users',
        icon: <UserOutlined />,
        label: 'Người dùng',
        onClick: () => router.push(ROUTE_DASHBOARD_USERS),
      });
    }

    items.push({
      key: 'stamps-tree',
      icon: <SafetyCertificateOutlined />,
      label: 'Tem chống giả',
      children: [
        {
          key: 'stamp-requests',
          icon: <CheckOutlined />,
          label: 'Yêu cầu cấp tem',
          onClick: () => router.push(ROUTE_DASHBOARD_STAMP_REQUESTS),
        },
        {
          key: 'stamp-batches',
          icon: <MenuOutlined />,
          label: 'Kích hoạt lô tem',
          onClick: () => router.push(ROUTE_DASHBOARD_STAMP_BATCHES),
        },
        {
          key: 'stamps',
          icon: <PicCenterOutlined />,
          label: 'Tem',
          onClick: () => router.push(ROUTE_DASHBOARD_STAMPS),
        },
      ],
    });

    return items;
  }, [session, router]);

  useEffect(() => {
    setSelectedKey([pathname.split('/')[2] ?? 'dashboard']);
  }, [pathname]);

  return (
    <Sider
      theme="dark"
      style={{ flex: 1 }}
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Flex justify="center" style={{ height: 64 }}>
        <GcheckLogo width={collapsed ? 64 : 96} />
      </Flex>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        selectedKeys={selectedKey}
        items={menuItems}
      />
    </Sider>
  );
}
