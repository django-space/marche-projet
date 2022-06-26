import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

import axios from "../../axios.config.js";
import PrivatePage from "../../components/pages/PrivatePage";
import FullScreenLoading from "../../components/loading/FullScreenLoading";
import MarcheDecomptesDataGrid from "../../components/marche/MarcheDecomptesDataGrid";
import MarcheOSDataGrid from "../../components/marche/MarcheOSDataGrid";
import MarcheInfoCard from "../../components/marche/MarcheInfoCard";

function MarcheDetailPage({ session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [marche, setMarche] = useState(null);

  useEffect(() => {
    async function fetchMarche() {
      if (router.query.id !== undefined && session.status !== "loading") {
        try {
          let response = await axios.get(`api/v1/marches/${router.query.id}/`, {
            headers: {
              Authorization: `Bearer ${session.data.accessToken}`,
            },
          });
          setMarche(response.data);
          console.log(response.data);
          setLoading(false);
        } catch {}
      }
    }
    fetchMarche();
  }, [router.query.id]);

  if (loading) return <FullScreenLoading />;

  return (
    <Container sx={{ paddingTop: 6, paddingBottom: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h2" mb={2}>
          Marche: {marche.n_marche}
        </Typography>
      </Box>
      <Divider />
      <Box pt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ flex: 1 }}>
          <MarcheInfoCard marche={marche} session={session} />
        </Box>
        {/*<Divider orientation="vertical" flexItem />*/}
        <Box sx={{ flex: 1 }}>
          <Box mb={4}>
            <MarcheOSDataGrid marche={marche} session={session} />
          </Box>
          <Box>
            <MarcheDecomptesDataGrid marche={marche} session={session} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default PrivatePage(MarcheDetailPage, "/api/auth/signin");
