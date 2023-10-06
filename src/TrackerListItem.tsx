import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Input from "@mui/material/Input";
import ListItemIcon from "@mui/material/ListItemIcon";

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

import { TrackerItem } from "./TrackerItem";

type TrackerListItemProps = {
  tracker: TrackerItem;
  onCountChange: (count: string) => void;
  showHidden: boolean;
};

export function TrackerListItem({
  tracker,
  onCountChange,
  showHidden,
}: TrackerListItemProps) {
  if (!tracker.visible && !showHidden) {
    return null;
  }

  return (
    <ListItem
      key={tracker.id}
      secondaryAction={
        <Input
          disableUnderline
          sx={{ width: 48 }}
          inputProps={{
            sx: {
              textAlign: "right",
            },
          }}
          value={tracker.count}
          onChange={(e) => {
            const newCount = e.target.value;
            onCountChange(newCount);
          }}
        />
      }
      divider
      selected={tracker.active}
      sx={{
        pr: "64px",
      }}
    >
      {!tracker.visible && showHidden && (
        <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
          <VisibilityOffRounded fontSize="small" />
        </ListItemIcon>
      )}
      <ListItemText sx={{ color: "text.primary" }} primary={tracker.name} />
    </ListItem>
  );
}
