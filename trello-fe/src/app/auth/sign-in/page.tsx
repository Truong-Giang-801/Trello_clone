import TrelloLogo from "@/common/components/TrelloLogo";
import SignInForm from "@/modules/auth/sign-in/components/SignInForm";
import { Flex, Layout } from "antd";

export default function SignInPage() {
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
          <SignInForm />
        </div>
      </Flex>
    </Layout>
  );
}
