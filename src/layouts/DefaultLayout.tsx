import SettingsDialog from "../pages/SettingsDialog";
import "./DefaultLayout.css";
import { NavigationDrawer } from "@/components/NavigationDrawer.tsx";
import { useSettingsStore } from "@/stores";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, Fab } from "@mui/material";
import { type ReactElement, useState } from "react";
import { Outlet } from "react-router";

function DefaultLayout(): ReactElement {
  const settingsStore = useSettingsStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <NavigationDrawer />
      <Outlet />
      <Badge
        badgeContent=" "
        color="error"
        overlap="circular"
        style={{
          position: "fixed",
          right: 32,
          bottom: 32,
        }}
        invisible={settingsStore.azureApiKey !== ""}
      >
        <Fab
          color="secondary"
          onClick={() => {
            setDialogOpen(!dialogOpen);
          }}
        >
          <SettingsIcon />
        </Fab>
      </Badge>
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
