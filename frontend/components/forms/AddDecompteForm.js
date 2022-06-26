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
    montant_decmopte: yup.string().required("Ce champ est requis"),
  })
  .required();

const AddDecompteForm = ({
  open,
  handleClose: baseHandleClose,
  successCallback,
  marche,
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
    // try {
      const response = await axios.post(
        "api/v1/decomptes/",
        {
          n_marche: marche.n_marche,
          montant_decmopte: data.montant_decmopte,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionData.accessToken}`,
          },
        }
      );
      notification.success({
        message: `Le marché "${response.data.n_marche}" a été créé avec succès`,
        placement: "bottomRight",
      });
      successCallback();
      handleClose();
    // } catch {
      // setError(true);
    // }
  };

  return (
    <Dialog
      fullScreen={!fullScreen}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle sx={{ textAlign: "center" }} id="responsive-dialog-title">
        Nouveau decompte
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
              <FormControl fullWidth error={errors.montant_decmopte?.message}>
                <Controller
                  name="montant_decmopte"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      id="montant_decmopte"
                      label="Montant decompte"
                      variant="standard"
                      error={errors.montant_decmopte?.message}
                      {...field}
                      fullWidth
                    />
                  )}
                />
                {errors.montant_decmopte?.message && (
                  <FormHelperText>
                    {errors.montant_decmopte.message}
                  </FormHelperText>
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

export default AddDecompteForm;
