import { useSession, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import FullScreenLoading from "../loading/FullScreenLoading";

function PublicPage(WrappedComponent, redirectTo = "/") {
  return function () {
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
      if (session.status === "authenticated") {
        router.push(redirectTo);
      } else if (session.status === "unauthenticated") {
        setLoading(false);
      }
    }, [session.status, router, session.data?.user]);

    if (loading || session.status == "loading") return <FullScreenLoading />;

    return <WrappedComponent session={session} />;
  };
}

export default PublicPage;
