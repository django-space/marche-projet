import PublicPage from "../components/pages/PublicPage";

function LoginPage({session}) {
  console.log(session);
  return (
    <div>Login page</div>
  );
}

export default PublicPage(LoginPage);
