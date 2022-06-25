import PrivatePage from "../components/pages/PrivatePage";
import styles from "../styles/Home.module.css";

function Home({ session }) {
  console.log(session);

  return <div>This page is private</div>;
}

export default PrivatePage(Home, "/api/auth/signin");
