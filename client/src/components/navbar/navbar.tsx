import {
  Box,
  Typography,
  Paper,
  InputBase,
  Button,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import "./navbar.css";

const Navbar = () => {
  const isSynced = true;

  return (
    <Paper className="navbar-root">
      <Typography variant="subtitle1" className="navbar-title">
        Dashboard
      </Typography>

      <Paper className="navbar-search" >
        <SearchIcon className="navbar-search-icon" />
        <InputBase
          placeholder="Search..."
          inputProps={{ "aria-label": "search" }}
          className="navbar-search-input"
        />
      </Paper>

      <Box className="navbar-actions">
        <Box className="navbar-sync">
          <FiberManualRecordIcon
            className={isSynced ? "navbar-dot dot-green" : "navbar-dot dot-red"}
          />
          <Typography
            variant="body2"
            className={isSynced ? "navbar-sync-text green" : "navbar-sync-text red"}
          >
            {isSynced ? "Synced" : "Unsynced"}
          </Typography>
        </Box>

        <Button variant="contained" size="small" className="navbar-button">
          + New Scenario
        </Button>

        <Avatar alt="User" src="/user.png" className="navbar-avatar" />
      </Box>
    </Paper>
  );
};

export default Navbar;
