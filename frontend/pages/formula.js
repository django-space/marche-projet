import { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { notification, Spin } from "antd";

import axios from "../axios.config";
import styles from "../styles/Formula.module.css";
import PrivatePage from "../components/pages/PrivatePage";

function FormulaPage() {
  const [formula, setFormula] = useState("");
  const [loadingVariables, setLoadingVariables] = useState(true);
  const [variables, setVariables] = useState([]);

  const insertVaiable = (variable) => {
    setFormula((prev) => prev + variable);
  };

  const handleTextAreaChange = (event) => {
    setFormula(event.target.value);
  };

  useEffect(() => {
    async function fetchVariables() {
      try {
        const response = await axios.get("api/v1/formula/get_variables/");
        setVariables(response.data.variables);
        setLoadingVariables(false);
      } catch {
        setLoadingVariables(false);
      }
    }
    fetchVariables();
  }, []);

  return (
    <Container sx={{ paddingTop: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h2" mb={2}>
          Formula
        </Typography>
        <Box>
          <Button
            sx={{
              marginRight: 2,
            }}
            variant="contained"
            onClick={() => {}}
          >
            Enregistrer la formule
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          marginTop: 3,
        }}
      >
        <Spin spinning={loadingVariables}>
          <Box
            sx={{
              flex: 1,
              height: "600px",
              width: "300px",
              border: "1px solid black",
            }}
          >
            {/* left box: variables */}
            {variables.map((v) => (
              <Box
                className={styles.variable_container}
                onDoubleClick={insertVaiable.bind(null, v)}
              >
                {v}
              </Box>
            ))}
          </Box>
        </Spin>
        <Box className={styles.formula_container}>
          {/* right box: formula */}
          <textarea
            name=""
            id=""
            className={styles.formula_input}
            value={formula}
            onChange={handleTextAreaChange}
          ></textarea>
        </Box>
      </Box>
    </Container>
  );
}

export default PrivatePage(FormulaPage, "/api/auth/signin");
