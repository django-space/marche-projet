import * as yup from "yup";
import { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import FormHelperText from "@mui/material/FormHelperText";
import Icon from "@mui/material/Icon";
import { useSession } from "next-auth/react";
import axios from "../../axios.config";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { notification, Spin } from "antd";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  EditFilled as EditIcon,
  DeleteFilled as DeleteIcon,
} from "@ant-design/icons";

const schema = yup
  .object({
    objet_marche: yup.string().required("Ce champ est requis"),
    montant_marche: yup.string().required("Ce champ est requis"),
  })
  .required();

function MarcheInfoCard({ marche: marcheData, session }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    isLoading,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [editingMode, setEditingMode] = useState(false);
  const { data: sessionData } = useSession();
  const [error, setError] = useState(false);
  const [marche, setMarche] = useState(marcheData);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/v1/marches/${marche.n_marche}/`, {
        headers: {
          Authorization: `Bearer ${session.data.accessToken}`,
        },
      });
      setMarche(response.data);
      setFormFields(response.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData().catch(console.log);
  }, []);

  const handleClose = () => {
    baseHandleClose();
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `api/v1/marches/${marche.n_marche}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session.data.accessToken}`,
          },
        }
      );
      setMarche(response.data);
      notification.success({
        message: `Le marché "${response.data.n_marche}" a été créé avec succès`,
        placement: "bottomRight",
      });
      setFormFields(response.data);
      setEditingMode(false);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError(false);
    setFormFields(marche);
    setEditingMode(false);
  };

  const setFormFields = (data) => {
    reset({
      objet_marche: data.objet_marche,
      montant_marche: data.montant_marche,
    });
  };

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
          Marche details
        </Typography>
        <Box>
          <IconButton
            sx={{ zIndex: 20 }}
            disabled={loading}
            onClick={() => setEditingMode(true)}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Box>
      <Spin spinning={loading}>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    Impossible de créer le marché, veuillez réessayer
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    id="n_marche"
                    label="Nmarche"
                    variant="standard"
                    fullWidth
                    value={marche?.n_marche}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    id="date_marche"
                    label="Date de marché"
                    variant="standard"
                    fullWidth
                    value={marche?.date_marche}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={errors.objet_marche?.message}>
                  <Controller
                    name="objet_marche"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        id="objet_marche"
                        label="Objectif de marché"
                        variant="standard"
                        error={errors.objet_marche?.message}
                        {...field}
                        multiline
                        rows={4}
                        fullWidth
                        InputProps={{
                          readOnly: !editingMode,
                        }}
                      />
                    )}
                  />
                  {errors.objet_marche?.message && (
                    <FormHelperText>
                      {errors.objet_marche.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={errors.montant_marche?.message}>
                  <Controller
                    name="montant_marche"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        id="montant_marche"
                        label="montant_marche"
                        variant="standard"
                        error={errors.montant_marche?.message}
                        {...field}
                        fullWidth
                        InputProps={{
                          readOnly: !editingMode,
                        }}
                      />
                    )}
                  />
                  {errors.montant_marche?.message && (
                    <FormHelperText>
                      {errors.montant_marche.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {editingMode ? (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    autoFocus
                    sx={{
                      backgroundColor: "#D6D6D6",
                      color: "#767676",
                      "&:hover": { backgroundColor: "#c1c1c1 !important" },
                      marginRight: 2,
                    }}
                    type="button"
                    variant="cancel"
                    onClick={handleCancel}
                  >
                    Annuler
                  </Button>
                  <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    type="submit"
                  >
                    Enregistrer
                  </LoadingButton>
                </Grid>
              ) : null}
            </Grid>
          </form>
        </Box>
      </Spin>
    </Container>
  );
}

export default MarcheInfoCard;
