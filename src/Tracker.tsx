import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Switch from '@mui/material/Switch';
import DeleteForever from "@mui/icons-material/DeleteForever";

import OBR, { isImage, Item, Player, Metadata } from "@owlbear-rodeo/sdk";

import { TrackerItem } from "./TrackerItem";

import addIcon from "./assets/add.svg";
import removeIcon from "./assets/remove.svg";

import { TrackerListItem } from "./TrackerListItem";
import { getPluginId } from "./getPluginId";
import { TrackerHeader } from "./TrackerHeader";
import { isPlainObject } from "./isPlainObject";

/** Check that the item metadata is in the correct format */
function isMetadata(
  metadata: unknown
): metadata is { ignore: boolean; active: boolean } {
  return (
    isPlainObject(metadata) &&
    typeof metadata.ignore === "boolean" &&
    typeof metadata.active === "boolean"
  );
}

export function Tracker() {
  const [trackerItems, setTrackerItems] = useState<TrackerItem[]>([]);
  const [role, setRole] = useState<"GM" | "PLAYER">("PLAYER");
  const [unclickable, setUnclickable] = useState(false);

  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
    };
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange(handlePlayerChange);
  }, []);

  
  useEffect(() => {
    const handleItemsChange = async (items: Item[]) => {
      const trackerItems: TrackerItem[] = [];
      for (const item of items) {
        if (isImage(item)) {
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            trackerItems.push({
              id: item.id,
              ignore: metadata.ignore,
              name: item.text.plainText || item.name,
              active: metadata.active,
            });
          }
        }
      }
      setTrackerItems(trackerItems);
    };

    OBR.scene.items.getItems().then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, []);

  useEffect(() => {
    OBR.contextMenu.create({
      icons: [
        {
          icon: addIcon,
          label: "Make intangible",
          filter: {
            every: [
              { key: "type", value: "IMAGE" },
              { key: ["metadata", getPluginId("metadata")], value: undefined },
            ],
            permissions: ["UPDATE"],
          },
        },
        {
          icon: removeIcon,
          label: "Make tangible",
          filter: {
            every: [
              { key: "type", value: "IMAGE" },
            ],
            permissions: ["UPDATE"],
          },
        },        
      ],
      id: getPluginId("menu/toggle"),
      onClick(context) {
        OBR.scene.items.updateItems(context.items, (items) => {
          // Check whether to add the items to tracker or remove them
          const addToTracker = items.every(
            (item) => item.metadata[getPluginId("metadata")] === undefined
          );
          for (let item of items) {
            if (addToTracker) {
              item.metadata[getPluginId("metadata")] = {
                ignore: true,
                active: false,
              };
              item.disableHit = true;
            } else {
              delete item.metadata[getPluginId("metadata")];
              item.disableHit = false;
            }
          }
        });
      },
    });
  }, []);

  function handleHeaderAction() {
    // Clear all
    OBR.scene.items.updateItems(
      trackerItems.map((tracker) => tracker.id),
      (items) => {
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            delete item.metadata[getPluginId("metadata")];
            item.disableHit = false;
          }
        }
      }
    );
  }

  function handleListItemDelete(id:string) {
    // Clear all
    OBR.scene.items.updateItems(
      trackerItems.map((tracker) => tracker.id),
      (items) => {
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata) && id === item.id) {
            delete item.metadata[getPluginId("metadata")];
            item.disableHit = false;
          }
        }
      }
    );    
  }

  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (listRef.current && ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const entry = entries[0];
          // Get the height of the border box
          // In the future you can use `entry.borderBoxSize`
          // however as of this time the property isn't widely supported (iOS)
          const borderHeight = entry.contentRect.bottom + entry.contentRect.top;
          // Set a minimum height of 64px
          const listHeight = Math.max(borderHeight, 64);
          // Set the action height to the list height + the card header height + the divider
          OBR.action.setHeight(listHeight + 64 + 1);
        }
      });
      resizeObserver.observe(listRef.current);
      return () => {
        resizeObserver.disconnect();
        // Reset height when unmounted
        OBR.action.setHeight(129);
      };
    }
  }, []);

  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  
  return (
    <Stack height="100vh">
      <TrackerHeader
        subtitle={
          trackerItems.length === 0
            ? "Select images on map and toggle them intangible"
            : undefined}
        action = {
          <IconButton
            aria-label="delete"
            onClick={handleHeaderAction}
            disabled={trackerItems.length === 0}
          >
            <DeleteForever />
          </IconButton>
        }
      />
      <Box sx={{ overflowY: "auto" }}>
        <List ref={listRef}>
          {trackerItems
            .map((tracker) => (
              <TrackerListItem
                key={tracker.id}
                tracker={tracker}
                actionHandler={() => {
                  handleListItemDelete(tracker.id);
                }}
                showHidden={role === "GM"}
                ignore={tracker.ignore}
              />
            ))}
        </List>
      </Box>
    </Stack>
  );
}
