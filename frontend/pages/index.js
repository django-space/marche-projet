import PrivatePage from "../components/pages/PrivatePage";
import styles from "../styles/Home.module.css";

export default function Home() {
  
  return (
    <PrivatePage redirectTo={"/api/auth/signin"}>
      <div>This page is private</div>
    </PrivatePage>
  );
}
