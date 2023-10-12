import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteForever from "@mui/icons-material/DeleteForever";
import DeleteIcon from '@mui/icons-material/Delete';

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

import { TrackerItem } from "./TrackerItem";

type TrackerListItemProps = {
  ignore: boolean;
  tracker: TrackerItem;
  actionHandler: () => void;
  showHidden: boolean;
};

export function TrackerListItem({
  tracker,
  actionHandler,
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
        pr: "64px"
      }}
      secondaryAction={
        <IconButton       sx={{marginRight: "-7px"}} edge="end" aria-label="delete" onClick={actionHandler}>
          <DeleteIcon />
        </IconButton>
      }

    >
      <ListItemText primaryTypographyProps={{fontSize: '0.9rem'}} sx={{ color: "text.primary" }} primary={tracker.name} />
    </ListItem>
  );
}
