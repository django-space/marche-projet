import { useSession, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import FullScreenLoading from "../loading/FullScreenLoading";

function PrivatePage(WrappedComponent, redirectTo = "/login") {
  return function () {
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
      if (session.status === "authenticated") {
        setLoading(false);
      } else if (session.status === "unauthenticated") {
        router.push(redirectTo);
      }
    }, [session.status, router, session.data?.user]);

    if (loading || session.status == "loading") return <FullScreenLoading />;

    return <WrappedComponent session={session} />;
  };
}

export default PrivatePage;
