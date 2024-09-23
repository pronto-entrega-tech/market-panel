import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Errors from "~/components/Errors";
import Loading from "~/components/Loading";
import GoBackHeader from "~/components/GoBackHeader";
import { api } from "~/services/api";
import { CreateSubDto, MarketSub, SubPermission } from "~/core/types";
import {
  CardsContainer,
  Card,
  CardActionArea,
  Title,
  Subtitle,
  Body,
  Input,
  CardButtons,
  IconButton,
  SelectButton,
  CreateButton,
  Stack,
  QRCodeContainer,
} from "./styles";
import { useLoading } from "~/hooks/useLoading";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Pencil as EditIcon, Delete as DeleteIcon } from "mdi-material-ui";
import { ModalState, useModalState } from "~/hooks/useModalState";
import { errMsg } from "~/constants/errorMessages";
import useMyContext from "~/core/context";
import { lightFormat } from "date-fns";
import { second } from "~/constants/time";
import { getTokenExp } from "~/functions/tokenExp";

const permissionsMap: { [x in SubPermission]: string } = {
  DELIVERY: "Entrega",
  STOCK: "Estoque",
};

const Subs = () => {
  const { alert } = useMyContext();
  const [isLoading, , withLoading] = useLoading();
  const [hasError, setError] = useState<unknown>();
  const [subs, setSubs] = useState<MarketSub[]>();
  const [dialogState, openDialog, closeDialog] = useModalState();
  const [updateDialogState, openUpdateDialog, closeUpdateDialog] =
    useModalState<MarketSub>();
  const [connectDialogState, openConnectDialog] = useModalState<MarketSub>();

  useEffect(() => {
    api.subs.findMany().then(setSubs).catch(setError);
  }, []);

  if (hasError) return <Errors type="server" />;
  if (!subs || isLoading) return <Loading />;

  const createSub = withLoading(async (dto: CreateSubDto) => {
    try {
      const sub = await api.subs.create(dto);

      setSubs(subs.concat(sub));
      closeDialog();
    } catch {
      alert(errMsg.server());
    }
  });

  const updateSub = withLoading(
    async (id: string, dto: Partial<CreateSubDto>) => {
      try {
        const sub = await api.subs.update(id, dto);

        setSubs(subs.map((v) => (v.id === sub.id ? { ...v, ...sub } : v)));
        closeUpdateDialog();
      } catch {
        alert(errMsg.server());
      }
    },
  );

  const deleteSub = (sub: MarketSub) => {
    const _delete = withLoading(async () => {
      try {
        await api.subs.delete(sub.id);

        setSubs(subs.filter((v) => v.id !== sub.id));
      } catch {
        alert(errMsg.server());
      }
    });

    alert(`Deletar ${sub.name}?`, "", {
      onConfirm: _delete,
    });
  };

  return (
    <>
      <GoBackHeader>Funcionários</GoBackHeader>
      <CardsContainer>
        {subs.map((sub, i) => {
          const { id, name, created_at, permissions } = sub;
          return (
            <Card key={id + i}>
              <CardActionArea onClick={() => openConnectDialog(sub)}>
                <Title>
                  {name}
                  <Subtitle>
                    {" - Criado em "}
                    {lightFormat(created_at, "dd/MM/yyyy 'ás' HH:mm")}
                  </Subtitle>
                </Title>
                <Body>
                  Permissões:{" "}
                  {permissions.map((v) => permissionsMap[v]).join(", ")}
                </Body>
              </CardActionArea>
              <CardButtons>
                <IconButton onClick={() => openUpdateDialog(sub)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteSub(sub)}>
                  <DeleteIcon />
                </IconButton>
              </CardButtons>
            </Card>
          );
        })}
      </CardsContainer>
      <CreateButton onClick={openDialog}>Criar</CreateButton>
      <CreateSubDialog state={dialogState} onCreate={createSub} />
      <UpdateSubDialog state={updateDialogState} onUpdate={updateSub} />
      <ConnectSubDialog state={connectDialogState} />
    </>
  );
};

const CreateSubDialog = (p: {
  state: ModalState;
  onCreate: (dto: CreateSubDto) => void;
}) => {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<SubPermission[]>([]);

  const canCreate = name && permissions.length;

  const create = () => p.onCreate({ name, permissions });

  const permissionsArr = Object.entries(permissionsMap) as [
    SubPermission,
    string,
  ][];

  const permissionsButton = permissionsArr.map(([permission, title]) => {
    const isSelected = permissions.includes(permission);

    const onSelect = () =>
      setPermissions(
        isSelected
          ? permissions.filter((v) => v !== permission)
          : permissions.concat(permission),
      );

    return (
      <SelectButton
        key={permission}
        className={isSelected ? "selected" : "unselected"}
        onClick={onSelect}
      >
        {title}
      </SelectButton>
    );
  });

  return (
    <Dialog open={p.state.isVisible} onClose={p.state.onDismiss}>
      <DialogTitle>Criar funcionário</DialogTitle>
      <DialogContent>
        <Input
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Stack>
          <DialogContentText>Permissões</DialogContentText>
          {permissionsButton}
          <CreateButton disabled={!canCreate} onClick={create}>
            Criar
          </CreateButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const UpdateSubDialog = (p: {
  state: ModalState<MarketSub>;
  onUpdate: (id: string, dto: CreateSubDto) => void;
}) => {
  const sub = p.state.modalData;

  const [name, setName] = useState<string>();
  const [permissions, setPermissions] = useState<SubPermission[]>();

  useEffect(() => {
    if (!sub?.name) return;

    setName(sub.name);
    setPermissions(sub.permissions);
  }, [sub?.name, sub?.permissions]);

  if (!sub || name === undefined || !permissions) return null;

  const canCreate = name && permissions.length;

  const update = () => p.onUpdate(sub.id, { name, permissions });

  const permissionsArr = Object.entries(permissionsMap) as [
    SubPermission,
    string,
  ][];

  const permissionsButton = permissionsArr.map(([permission, title]) => {
    const isSelected = permissions.includes(permission);

    const onSelect = () =>
      setPermissions(
        isSelected
          ? permissions.filter((v) => v !== permission)
          : permissions.concat(permission),
      );

    return (
      <SelectButton
        key={permission}
        className={isSelected ? "selected" : "unselected"}
        onClick={onSelect}
      >
        {title}
      </SelectButton>
    );
  });

  return (
    <Dialog open={p.state.isVisible} onClose={p.state.onDismiss}>
      <DialogTitle>Atualizar funcionário</DialogTitle>
      <DialogContent>
        <Input
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Stack>
          <DialogContentText>Permissões</DialogContentText>
          {permissionsButton}
          <CreateButton disabled={!canCreate} onClick={update}>
            Atualizar
          </CreateButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const ConnectSubDialog = (p: { state: ModalState<MarketSub> }) => {
  const [hasError, setError] = useState(false);
  const [connectToken, setConnectToken] = useState<string>();

  const sub = p.state.modalData;
  const tokenExp = connectToken && +getTokenExp(connectToken);

  useEffect(() => {
    if (!sub?.id) return;

    const fetchToken = () => {
      setConnectToken(undefined);

      api.subs
        .connectToken(sub.id)
        .then(({ connect_token }) => setConnectToken(connect_token))
        .catch(() => setError(true));
    };

    if (!tokenExp) return fetchToken();

    const timeLeft = tokenExp - Date.now();

    const revalidateTimeout = setTimeout(fetchToken, timeLeft - 60 * second);
    return () => clearTimeout(revalidateTimeout);
  }, [sub?.id, tokenExp]);

  return (
    <Dialog open={p.state.isVisible} onClose={p.state.onDismiss}>
      <DialogTitle>{sub?.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>QR Code de conexão</DialogContentText>
        <QRCodeContainer>
          {connectToken ? (
            <QRCode value={connectToken} />
          ) : hasError ? (
            <Errors type="server" />
          ) : (
            <Loading />
          )}
        </QRCodeContainer>
      </DialogContent>
    </Dialog>
  );
};

export default Subs;
