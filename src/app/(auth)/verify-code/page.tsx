import VerifyCodeClient from "./VerifyCodeClient";

type VerifyCodePageProps = {
  searchParams?: {
    email?: string;
    code?: string;
  };
};

export default function VerifyCodePage({ searchParams }: VerifyCodePageProps) {
  return (
    <VerifyCodeClient
      initialEmail={searchParams?.email ?? null}
      initialCode={searchParams?.code ?? null}
    />
  );
}

