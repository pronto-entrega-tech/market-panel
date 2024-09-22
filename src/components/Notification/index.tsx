import { Close as CloseIcon } from "mdi-material-ui";
import { Slide } from "@mui/material";
import useMyContext from "~/core/context";
import { Notification, IconButton } from "./styles";
import { useState, useEffect } from "react";

export type Notif = {
  title: string;
  body?: string;
  metadata?: any;
};

const Notifications = () => {
  const { notifies, removeNotify } = useMyContext();
  const [_notifies, _setNotifies] = useState<typeof notifies>([]);

  useEffect(() => {
    setTimeout(() => _setNotifies(notifies), 300);
  }, [notifies]);

  return (
    <>
      {_notifies.map((v, i) => (
        <Notification
          key={v.title}
          message={v.title}
          action={
            <IconButton onClick={() => removeNotify(i)}>
              <CloseIcon />
            </IconButton>
          }
          open={notifies.includes(v)}
          TransitionComponent={Slide}
        />
      ))}
    </>
  );
};

export default Notifications;
