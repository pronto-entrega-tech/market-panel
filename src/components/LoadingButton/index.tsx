import { Button, CircularProgress } from "@mui/material";

const LoadingButton = (
  p: { loading: boolean } & Parameters<typeof Button>[0],
) => {
  return (
    <Button disabled={p.loading} {...p}>
      {p.loading ? <CircularProgress size={28} /> : p.children}
    </Button>
  );
};

export default LoadingButton;
