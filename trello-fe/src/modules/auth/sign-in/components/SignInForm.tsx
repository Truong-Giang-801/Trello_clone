"use client";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, FormProps, Input, Typography } from "antd";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignInDto } from "../dto/sign-in.dto";

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const onFinish: FormProps<SignInDto>["onFinish"] = async (values) => {
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
      <Form.Item<SignInDto>
        name="email"
        rules={[{ required: true, message: "Nhập email" }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      {/* Password */}
      <Form.Item<SignInDto>
        name="password"
        rules={[{ required: true, message: "Nhập mật khẩu" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>

      {/* Đăng nhập */}
      <Form.Item style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" block loading={loading}>
          ĐĂNG NHẬP
        </Button>
      </Form.Item>

      {/* Tạo tài khoản */}
      <Form.Item>
        <Button
          color="primary"
          variant="outlined"
          block
          onClick={() => router.push("/auth/sign-up")}
        >
          TẠO TÀI KHOẢN MỚI
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
