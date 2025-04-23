'use client';

import { getFileStreamUrl } from '@/common/utils/file.util';
import { signOutHandler } from '@/modules/auth/auth.service';
import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Flex, MenuProps, Space, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'editProfile',
        label: 'Sửa hồ sơ',
        icon: <UserOutlined />,
        onClick: () => router.push('/dashboard/my-profile/edit'),
      },
      {
        key: 'changePassword',
        label: 'Đổi mật khẩu',
        icon: <LockOutlined />,
        onClick: () => router.push('/dashboard/my-profile/change-password'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        onClick: () => signOutHandler(),
      },
    ],
    [router],
  );

  return (
    <Header style={{ padding: 0, backgroundColor: colorBgContainer }}>
      <Flex
        align="center"
        justify="end"
        style={{
          padding: '0 16px',
        }}
      >
        <Dropdown menu={{ items: menuItems }}>
          <Space style={{ cursor: 'pointer' }}>
            {session?.user.userProfile.avatarFile ? (
              <Avatar
                size={32}
                src={getFileStreamUrl(
                  session?.user.userProfile.avatarFile.minioKey,
                )}
              />
            ) : (
              <Avatar size={32} icon=<UserOutlined /> />
            )}
            {session?.user.userProfile.name ?? session?.user.email}
          </Space>
        </Dropdown>
      </Flex>
    </Header>
  );
}
