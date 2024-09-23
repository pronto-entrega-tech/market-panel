import { useState } from "react";
import {
  Row,
  Title,
  Button,
  Dialog,
  DialogContainer,
  DialogTitle,
  DialogButton,
} from "./styles";
import { dbCreateUser, dbRead } from "~/core/dbConnect";
import { Circle as ConnectionIcon } from "mdi-material-ui";

type DialogData = {
  title: string;
} & (
  | { values?: undefined }
  | {
      values: string[];
      multiSelect?: false;
      confirm: (value: string) => void;
    }
  | {
      values: string[];
      multiSelect: true;
      confirm: (value: string[]) => void;
    }
);

function Plugin() {
  const [isIntegrated, setIntegrated] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<DialogData>();

  const dialog = (title: string, items: string[]) =>
    new Promise<string>((resolve) => {
      setDialogData({
        title,
        values: items,
        confirm: resolve,
      });
    });
  const dialogMulti = (title: string, items: string[]) =>
    new Promise<string[]>((resolve) => {
      setDialogData({
        title,
        values: [...items, "confirmar"],
        confirm: resolve,
        multiSelect: true,
      });
    });

  const autoConfig = async () => {
    setDialogData({ title: "Carregando..." });
    setDialogOpen(true);

    const res = await dbCreateUser(dialog, dialogMulti);

    setIntegrated(res === "success");
    const title = {
      success: "Configurado com sucesso",
      error: "Erro, não foi possível auto configurar",
      restart: "Reinicie o banco de dados, e tente novamente",
    }[res];
    setDialogData({ title });
  };
  return (
    <>
      <Row>
        <ConnectionIcon
          fontSize="small"
          color={isIntegrated ? "success" : "error"}
        />
        {/* {isIntegrated ? (
          <PlugIcon color='success' />
        ) : (
          <PlugOffIcon color='error' />
        )} */}
        <Title>Sistema{isIntegrated ? "" : " não"} integrado</Title>
      </Row>
      <Button onClick={autoConfig}>Auto configurar</Button>
      <Button onClick={dbRead}>teste</Button>
      <PluginDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        data={dialogData}
      />
    </>
  );
}

function PluginDialog({
  isOpen,
  onClose: close,
  data = {} as DialogData,
}: {
  isOpen: boolean;
  onClose: () => void;
  data?: DialogData;
}) {
  const [columns, setColumns] = useState<string[]>([]);

  const rows = data.values?.map((value, i) => {
    const isSelected = columns.includes(value);
    const isConfirmButton = data.multiSelect && i === data.values.length - 1;

    const addColumn = () => {
      if (isSelected) {
        setColumns(columns.filter((i) => i !== value));
      } else {
        setColumns(columns.concat(value));
      }
    };
    const confirm = () => {
      close();
      setColumns([]);

      if (data.multiSelect) {
        data.confirm(columns);
      } else {
        data.confirm(value);
      }
    };
    return (
      <DialogButton
        key={value}
        onClick={isConfirmButton ? confirm : addColumn}
        variant={isConfirmButton ? "contained" : "text"}
        color={isSelected || isConfirmButton ? "primary" : undefined}
      >
        {value}
      </DialogButton>
    );
  });
  return (
    <Dialog open={isOpen}>
      <DialogContainer>
        <DialogTitle>{data.title}</DialogTitle>
        {rows}
        <DialogButton color="primary" variant="outlined" onClick={close}>
          Fechar
        </DialogButton>
      </DialogContainer>
    </Dialog>
  );
}

export default Plugin;
