import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Input from "@mui/material/Input";
import ListItemIcon from "@mui/material/ListItemIcon";

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

import { TrackerItem } from "./TrackerItem";

type TrackerListItemProps = {
  ignore: boolean;
  tracker: TrackerItem;
  showHidden: boolean;
};

export function TrackerListItem({
  tracker,
  showHidden,
}: TrackerListItemProps) {
  if (!showHidden) {
    return null;
  }

  return (
    <ListItem
      key={tracker.id}
      selected={tracker.active}
      sx={{
        pr: "64px",
      }}
    >
      <ListItemText primaryTypographyProps={{fontSize: '0.9rem'}} sx={{ color: "text.primary" }} primary={tracker.name} />
    </ListItem>
  );
}
