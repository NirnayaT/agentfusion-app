import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalculateIcon from "@mui/icons-material/Calculate";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import CampaignIcon from "@mui/icons-material/Campaign";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";
import "./sidebar.css";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Calculators", icon: <CalculateIcon /> },
  { text: "Market Rates", icon: <ShowChartIcon /> },
  { text: "Scenarios", icon: <ViewTimelineIcon /> },
  { text: "Reminders", icon: <AccessAlarmIcon /> },
  { text: "Marketing", icon: <CampaignIcon /> },
  { text: "Settings", icon: <SettingsIcon /> },
];

const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  return (
    <Drawer variant="permanent" className="sidebar-root">
      <Box className="sidebar-top">
        <Toolbar>
          <img src="/logo.png" alt="Agent Fusion" />
        </Toolbar>

        <List>
          {menuItems?.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => setSelectedItem(item.text)}
              className={`sidebar-item ${
                selectedItem === item.text ? "selected" : ""
              }`}
            >
              <ListItemIcon className="sidebar-icon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} className="sidebar-text" />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box className="sidebar-bottom">
        <Divider className="sidebar-divider" />
        <List>
          <ListItem
            onClick={() => setSelectedItem("Help & Feedback")}
            className={`sidebar-item ${
              selectedItem === "Help & Feedback" ? "selected" : ""
            }`}
            sx={{ margin: "0px" }}
          >
            <ListItemIcon className="sidebar-icon">
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Feedback" className="sidebar-text" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
