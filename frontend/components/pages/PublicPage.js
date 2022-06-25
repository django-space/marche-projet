import { useSession, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import FullScreenLoading from "../loading/FullScreenLoading";


function PublicPage({ children, redirectTo = "/" }) {
  const [loading, setLoading] = useState(true);
  const { data: sessionData, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push(redirectTo);
    } else if (sessionStatus === "unauthenticated") {
      setLoading(false);
    }
  }, [sessionStatus, router, sessionData?.user]);

  if (loading || sessionStatus == "loading") return <FullScreenLoading />;

  return <>{children}</>;
}

export default PublicPage;
