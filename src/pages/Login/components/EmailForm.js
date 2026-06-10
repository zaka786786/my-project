import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

const EmailForm = ({
  handleSubmitEmail,
  setErrorMessage,
  handleMove,
  isLoading,
  handleFormState,
}) => {
  handleFormState(0);
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      handleMove();
      return;
    }
      handleSubmitEmail(email);
  };

  return (
    <>
      <div className="col-12 text-center ">
        <h3 className="login-text">Forgot Password</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="col-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            required
              placeholder="Email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-2">
          <div className="position-relative">
            <div
              className="float-end pb-2 pointer"
              onClick={() => handleFormState(-1)}
            >
              <a className="text-muted">Back to Login </a>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Button
            type="submit"
            variant="contained"
            className="w-100 Login-page-button"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EmailForm;
