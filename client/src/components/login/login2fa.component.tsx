import React, { useReducer } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";

import QrCodeIcon from "@mui/icons-material/QrCode";

import { Navigate, useSearchParams } from "react-router-dom";
import { reducer } from "../../common/helper";
import twoFaService from "../../services/twoFa.service";

interface State {
  code: string;
  verified: boolean;
}

const Loging2FaButton = ({userId, code, setState,
}: {
  userId: string;
  code: string;
  setState: React.Dispatch<React.SetStateAction<State>>;
}) => {
  const handleAuthentication = () => {
	const check = twoFaService.Login2Fa(code, userId);
	setState({code:"", verified: check});
  };

  return (
    <>
      <Button
        className="md-primary"
        variant="contained"
        size="large"
        sx={{ marginRight: 3.5, backgroundColor: "#B700cc" }}
        onClick={handleAuthentication}
      >
        Send
      </Button>
    </>
  );
};

interface TwoFactorAuthContentProps {
  code: string;
  setState: React.Dispatch<React.SetStateAction<{ code: string }>>;
}

const TwoFactorAuthContent: React.FC<TwoFactorAuthContentProps> = ({
  code,
  setState,
}) => {
  const handle2FaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ code: event.target.value });
  };

  const handle2FaKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <>
      <CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
        <Typography
          align="left"
          sx={{
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          Enter two-factor authentication code below

          <Grid item xs={12} sx={{ marginTop: 6 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="account-login-2fa">Code</InputLabel>
              <OutlinedInput
                label="Code"
                value={code}
                id="account-login-2fa"
                onChange={handle2FaChange}
                onKeyDown={handle2FaKeyDown}
                type={"text"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" aria-label="qrCode">
                      <QrCodeIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Typography>
      </CardContent>
    </>
  );
};

export const Login2Fa = () => {
  const [state, setState] = useReducer(reducer, {
    code: "",
    verified: false,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const userId = searchParams.get('user');

  if (!userId) {
    return <Navigate to="/" />;
  }

  if (state.verified) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Card style={{ minWidth: "300px" }} className="md-layout-item md-size-65">
          <TwoFactorAuthContent code={state.code} setState={setState} />
          <CardActions sx={{ justifyContent: "center", paddingTop: 8 }}>
            <Loging2FaButton userId={userId} code={state.code} setState={setState} />
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default Login2Fa;
