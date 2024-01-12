import SettingsDialog from "../pages/SettingsDialog";
import { NavigationDrawer } from "@/components/NavigationDrawer.tsx";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Fab } from "@mui/material";
import { type ReactElement, useState } from "react";
import { Outlet } from "react-router";

function DefaultLayout(): ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <NavigationDrawer />
      <Outlet />
      <Fab
        color="secondary"
        style={{
          position: "fixed",
          right: 32,
          bottom: 32,
        }}
        onClick={() => {
          setDialogOpen(!dialogOpen);
        }}
      >
        <SettingsIcon />
      </Fab>
      <SettingsDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      />
    </Box>
  );
}

export default DefaultLayout;
