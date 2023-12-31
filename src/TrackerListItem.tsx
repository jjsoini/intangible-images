import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import Tooltip from '@mui/material/Tooltip';


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
        <Tooltip title="Release" placement="left">
          <IconButton sx={{marginRight: "-2px"}} edge="end" aria-label="release" onClick={actionHandler}>
            <DoNotTouchIcon sx={{opacity: 0.5}} />
          </IconButton>
        </Tooltip>
        
      }

    >
      <ListItemText primaryTypographyProps={{fontSize: '0.9rem'}} sx={{ color: "text.primary" }} primary={tracker.name} />
    </ListItem>
  );
}
