import { Dialog, DialogContentText } from "@mui/material";
import { useEffect, useState } from "react";
import useMyContext from "~/core/context";
import { Title, DialogContent, Input, Button, ButtonContainer } from "./styles";

export type AlertState = {
  title: string;
  subtitle?: string;
  confirmTitle?: string;
  cancelTitle?: string;
  onCancel?: () => void;
} & (
  | {
      showInput?: false;
      onConfirm?: () => void;
    }
  | {
      showInput: true;
      onConfirm: (value: string) => void;
    }
);

const ModalAlert = () => {
  const { alertState: _state, dismissAlert } = useMyContext();
  const [alertState, setAlertState] = useState(_state);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (_state) setAlertState(_state);
  }, [_state]);

  const closeAnd = (fn?: () => void) => () => {
    fn?.();
    dismissAlert();
  };

  const { onConfirm: confirm, onCancel: cancel } = alertState ?? {};

  const buttons = alertState?.onConfirm ? (
    <>
      <Button onClick={closeAnd(cancel)} variant="outlined" className="cancel">
        {alertState.cancelTitle ?? "Cancelar"}
      </Button>
      <Button onClick={closeAnd(() => confirm?.(input))}>
        {alertState.confirmTitle ?? "Confirmar"}
      </Button>
    </>
  ) : (
    <Button onClick={closeAnd(cancel)}>Ok</Button>
  );

  return (
    <Dialog open={!!_state} onClose={closeAnd(cancel)}>
      <Title>{alertState?.title}</Title>
      <DialogContent>
        <DialogContentText>{alertState?.subtitle}</DialogContentText>
        {alertState?.showInput && (
          <Input onChange={(e) => setInput(e.target.value)} autoFocus />
        )}
        <ButtonContainer>{buttons}</ButtonContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAlert;
