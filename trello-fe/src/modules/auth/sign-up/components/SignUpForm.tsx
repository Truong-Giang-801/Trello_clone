"use client";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, FormProps, Input, Typography } from "antd";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation"; // 🔺 thêm vào đây
import { useState } from "react";
import { SignUpDto } from "../dto/sign-up.dto";

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter(); // 🔺 thêm router

  const onFinish: FormProps<SignUpDto>["onFinish"] = async (values) => {
    setError(undefined);
    setLoading(true);

    try {
      await console.log("signInHandler", values);
    } catch (e) {
      if (isRedirectError(e)) {
        throw e;
      }

      console.log(e);
      setError("Thông tin đăng nhập chưa đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="signInForm"
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Email */}
      <Form.Item<SignUpDto>
        name="email"
        rules={[{ required: true, message: "Nhập email" }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      {/* Username */}
      <Form.Item<SignUpDto>
        name="username"
        rules={[{ required: true, message: "Chọn tên đăng nhập" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
      </Form.Item>

      {/* Password */}
      <Form.Item<SignUpDto>
        name="password"
        rules={[{ required: true, message: "Nhập mật khẩu" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>

      {/* Password */}
      <Form.Item<SignUpDto>
        name="confirmPassword"
        rules={[{ required: true, message: "Nhập lại mật khẩu" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Xác nhận mật khẩu"
        />
      </Form.Item>

      {/* Đăng ký */}
      <Form.Item style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" block loading={loading}>
          ĐĂNG KÝ
        </Button>
      </Form.Item>

      {/* Đã có tài khoản */}
      <Form.Item>
        <Button
          color="primary"
          variant="outlined"
          block
          onClick={() => router.push("/auth/sign-in")}
        >
          ĐÃ CÓ TÀI KHOẢN?
        </Button>
      </Form.Item>

      {/* Footer */}
      <Form.Item style={{ textAlign: "center" }}>
        <Typography.Text type="secondary">
          &copy; {new Date().getFullYear()} Trello
        </Typography.Text>
      </Form.Item>
    </Form>
  );
}
