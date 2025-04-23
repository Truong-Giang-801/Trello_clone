import TrelloLogo from "@/common/components/TrelloLogo";
import SignUpForm from "@/modules/auth/sign-up/components/SignUpForm";
import { Flex, Layout } from "antd";

export default function SignUpPage() {
  return (
    <Layout>
      <Flex
        justify="center"
        align="center"
        vertical
        style={{ height: "100vh" }}
      >
        <div
          style={{
            maxWidth: 357,
            width: "100%",
          }}
        >
          <Flex vertical align="center" style={{ marginBottom: 24 }}>
            <TrelloLogo width={169} />
          </Flex>
          <SignUpForm />
        </div>
      </Flex>
    </Layout>
  );
}
