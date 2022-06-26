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
import Select from "@mui/material/Select";
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
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";

import { notification } from "antd";

const schema = yup
  .object({
    type_os: yup
      .string()
      .oneOf(["N", "C", "A", "R"])
      .required("Ce champ est requis"),
  })
  .required();

const AddOSForm = ({
  open,
  handleClose: baseHandleClose,
  successCallback,
  marche,
  passedData = { type_os: "" },
  action = "CREATE",
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
    defaultValues: {
      type_os: "",
    },
  });
  const { data: sessionData } = useSession();
  const [error, setError] = useState(false);

  const handleClose = () => {
    baseHandleClose();
    reset();
  };

  useEffect(() => {
    reset({ name: passedData?.type_os });
  }, [passedData]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "api/v1/os/",
        {
          type_os: data.type_os,
          n_marche: marche.n_marche,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionData.accessToken}`,
          },
        }
      );
      notification.success({
        message: `L'operation de service "${response.data.n_marche}-${response.data.n_os}" a été créé avec succès`,
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
        Nouveau operation de services
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
              <FormControl fullWidth error={errors.type_os?.message}>
                <InputLabel id="type_os" sx={{ marginLeft: "-15px" }}>
                  Type
                </InputLabel>
                <Controller
                  name="type_os"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        id="type_os"
                        labelId="type_os"
                        label="type_os"
                        variant="standard"
                        error={errors.type_os?.message}
                        {...field}
                      >
                        <MenuItem value="N">Notification</MenuItem>
                        <MenuItem value="A">Arrete</MenuItem>
                        <MenuItem value="C">Commencement</MenuItem>
                        <MenuItem value="R">Reprise</MenuItem>
                      </Select>
                    </>
                  )}
                />
                {errors.type_os?.message && (
                  <FormHelperText>{errors.type_os.message}</FormHelperText>
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

export default AddOSForm;
