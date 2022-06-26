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
  PlusOutlined as PlusIcon,
  ReloadOutlined as ReloadIcon,
} from "@ant-design/icons";
import { notification, Spin } from "antd";

import axios from "../../axios.config";
import AddDecompteForm from "../forms/AddDecompteForm";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";

function MarcheDecomptesDataGrid({ marche, session }) {
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
    (params) => async () => {
      setLoading(true);
      try {
        const response = await axios.delete(
          `api/v1/decomptes/${params.id}/`,
          null,
          {
            headers: {
              Authorization: `Bearer ${session.data.accessToken}`,
            },
          }
        );
        notification.success({
          message: `Le decompte "${params.row.n_decompte}" a été supprimé avec succès`,
          placement: "bottomRight",
        });
      } catch {
        notification.error({
          message: `Le decompte n'a pas pu être supprimé, veuillez réessayer`,
          placement: "bottomRight",
        });
      } finally {
        setLoading(false);
        fetchData(currentPage);
      }
    },
    []
  );

  const fetchData = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `api/v1/marches/${marche.n_marche}/decomptes/?page=${page + 1}`,
        {
          headers: {
            Authorization: `Bearer ${session.data.accessToken}`,
          },
        }
      );
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
  }, []);

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
        field: "id",
        headerName: "ID",
        editable: false,
        flex: 1,
      },
      {
        field: "n_decompte",
        headerName: "#Compte",
        editable: false,
        flex: 1,
      },
      {
        field: "date_decompte",
        headerName: "Date de decompte",
        editable: false,
        flex: 3,
      },
      {
        field: "montant_decmopte",
        headerName: "Montant de decompte",
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
            onClick={deleteRecord(params)}
          />,
        ],
      },
    ],
    [deleteRecord]
  );

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" component="h2" mb={2}>
          Decomptes
        </Typography>
        <Box>
          <IconButton
            sx={{ zIndex: 20 }}
            disabled={loading}
            onClick={fetchData}
          >
            <ReloadIcon />
          </IconButton>
          <IconButton
            sx={{ zIndex: 20 }}
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <PlusIcon />
          </IconButton>
        </Box>
      </Box>
      {/*<Divider />*/}
      <AddDecompteForm
        open={open}
        handleClose={handleClose}
        successCallback={fetchData}
        marche={marche}
      />
      <Spin spinning={loading}>
        <Box pt={1} sx={{ height: 300, width: "100%" }}>
          <DataGrid
            rows={rows}
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
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
          />
        </Box>
      </Spin>
    </Container>
  );
}

export default MarcheDecomptesDataGrid;
