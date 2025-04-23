import { Result } from "antd";
import Link from "next/link";

export default function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang bạn đang truy cập không tồn tại."
      extra={<Link href="/">Back Home</Link>}
    />
  );
}
