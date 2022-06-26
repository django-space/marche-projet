import * as yup from "yup";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
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
import Button from "@mui/material/Button";

import { notification } from "antd";

const schema = yup
  .object({
    n_marche: yup.string().required("Ce champ est requis"),
    objet_marche: yup.string().required("Ce champ est requis"),
    montant_marche: yup.string().required("Ce champ est requis"),
  })
  .required();

const AddMarcheForm = ({
  open,
  handleClose: baseHandleClose,
  successCallback,
}) => {
  const fullScreen = useMediaQuery("(min-width:860px)");
  const {
    control,
    handleSubmit,
    formState: { errors },
    isLoading,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { data: sessionData } = useSession();
  const [error, setError] = useState(false);

  const handleClose = () => {
    baseHandleClose();
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("api/v1/marches/", data, {
        headers: {
          Authorization: `Bearer ${sessionData.accessToken}`,
        },
      });
      notification.success({
        message: `Le marché "${response.data.n_marche}" a été créé avec succès`,
        placement: "bottomRight",
      });
      successCallback();
      handleClose();
    } catch {
      setError(true);
    }
  };

  return (
    <Dialog
      fullScreen={!fullScreen}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle sx={{ textAlign: "center" }} id="responsive-dialog-title">
        Nouveau marché
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ minWidth: "600px" }}>
          <Grid container spacing={3}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">
                  Impossible de créer le marché, veuillez réessayer
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth error={errors.n_marche?.message}>
                <Controller
                  name="n_marche"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      id="n_marche"
                      label="Nmarche"
                      variant="standard"
                      error={errors.n_marche?.message}
                      {...field}
                      fullWidth
                    />
                  )}
                />
                {errors.n_marche?.message && (
                  <FormHelperText>{errors.n_marche.message}</FormHelperText>
                )}
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
                    />
                  )}
                />
                {errors.objet_marche?.message && (
                  <FormHelperText>{errors.objet_marche.message}</FormHelperText>
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
                    />
                  )}
                />
                {errors.montant_marche?.message && (
                  <FormHelperText>{errors.montant_marche.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            sx={{
              backgroundColor: "#D6D6D6",
              color: "#767676",
              "&:hover": { backgroundColor: "#c1c1c1 !important" },
            }}
            type="button"
            variant="cancel"
            onClick={handleClose}
          >
            Annuler
          </Button>
          <LoadingButton loading={isLoading} variant="contained" type="submit">
            Enregistrer
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMarcheForm;
