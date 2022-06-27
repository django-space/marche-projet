import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  EditFilled as EditIcon,
  DeleteFilled as DeleteIcon,
  ReloadOutlined as ReloadIcon,
} from "@ant-design/icons";
import { notification, Spin } from "antd";
import { format } from "date-fns";

import axios from "../axios.config";
import PrivatePage from "../components/pages/PrivatePage";
import AddMarcheForm from "../components/forms/AddMarcheForm";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import styles from "../styles/Home.module.css";

function Home({ session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [open, setOpen] = useState(false);

  const deleteRecord = useCallback(
    (id) => async () => {
      setLoading(true);
      try {
        const response = await axios.delete(`api/v1/marches/${id}/`, {
          headers: {
            Authorization: `Bearer ${session.data.accessToken}`,
          },
        });
        notification.success({
          message: `Le marché "${id}" a été supprimé avec succès`,
          placement: "bottomRight",
        });
      } catch {
        notification.error({
          message: `Le marché n'a pas pu être supprimé, veuillez réessayer`,
          placement: "bottomRight",
        });
      } finally {
        setLoading(false);
        fetchData(currentPage);
      }
    },
    []
  );

  const fetchData = useCallback(
    async (page = 0) => {
      console.log(page)
      setLoading(true);
      try {
        const response = await axios.get(`api/v1/marches/?page=${page + 1}`, {
          headers: {
            Authorization: `Bearer ${session.data.accessToken}`,
          },
        });
        setPaginationInfo({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
        setRows(response.data.results);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    },
    [session]
  );

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  const getNextPaginatedData = async (page) => {
    setCurrentPage(page);
    await fetchData(page);
  };

  const columns = useMemo(
    () => [
      {
        field: "n_marche",
        headerName: "Nmarche",
        editable: false,
        flex: 1,
      },
      {
        field: "date_marche",
        headerName: "Date de marche",
        editable: false,
        flex: 1,
        valueFormatter: (params) => {
          return format(new Date(params.value), "dd/MM/yyyy");
        },
      },
      {
        field: "montant_marche",
        headerName: "Montant de marche",
        editable: false,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => router.push(`/marches/${params.id}`)}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteRecord(params.id)}
          />,
        ],
      },
    ],
    [deleteRecord]
  );

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
          Marches
        </Typography>
        <Box>
          <Button
            sx={{
              marginRight: 2
            }}
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
          >
            Nouveau marché
          </Button>
          <IconButton
            sx={{ zIndex: 20 }}
            disabled={loading}
            onClick={() => fetchData()}
          >
            <ReloadIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <AddMarcheForm
        open={open}
        handleClose={handleClose}
        successCallback={fetchData}
      />
      <Spin spinning={loading}>
        <Box pt={3} sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            autoHeight
            getRowId={(row) => row.n_marche}
            paginationMode="server"
            disableColumnFilter
            rowCount={paginationInfo.count}
            disableColumnMenu={false}
            disableColumnSelector
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            pagination
            checkboxSelection={false}
            disableSelectionOnClick
            onPageChange={getNextPaginatedData}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay.bind(null, {
                noDataMessage: "Pas de marchés",
              }),
              LoadingOverlay: LinearProgress,
            }}
          />
        </Box>
      </Spin>
    </Container>
  );
}

export default PrivatePage(Home, "/api/auth/signin");
