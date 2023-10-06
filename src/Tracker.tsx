import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import SkipNextRounded from "@mui/icons-material/SkipNextRounded";

import OBR, { isImage, Item, Player } from "@owlbear-rodeo/sdk";

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
): metadata is { count: string; active: boolean } {
  return (
    isPlainObject(metadata) &&
    typeof metadata.count === "string" &&
    typeof metadata.active === "boolean"
  );
}

export function Tracker() {
  const [trackerItems, setTrackerItems] = useState<TrackerItem[]>([]);
  const [role, setRole] = useState<"GM" | "PLAYER">("PLAYER");

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
              count: metadata.count,
              name: item.text.plainText || item.name,
              active: metadata.active,
              visible: item.visible,
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
          label: "Add to Tracker",
          filter: {
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT" },
              { key: "type", value: "IMAGE" },
              { key: ["metadata", getPluginId("metadata")], value: undefined },
            ],
            permissions: ["UPDATE"],
          },
        },
        {
          icon: removeIcon,
          label: "Remove from Tracker",
          filter: {
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT" },
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
          let count = 0;
          for (let item of items) {
            if (addToTracker) {
              item.metadata[getPluginId("metadata")] = {
                count: `${count}`,
                active: false,
              };
              count += 1;
            } else {
              delete item.metadata[getPluginId("metadata")];
            }
          }
        });
      },
    });
  }, []);

  function handleNextClick() {
    // Get the next index to activate
    const sorted = trackerItems.sort(
      (a, b) => parseFloat(b.count) - parseFloat(a.count)
    );
    const nextIndex =
      (sorted.findIndex((tracker) => tracker.active) + 1) % sorted.length;

    // Set local items immediately
    setTrackerItems((prev) => {
      return prev.map((init, index) => ({
        ...init,
        active: index === nextIndex,
      }));
    });
    // Update the scene items with the new active status
    OBR.scene.items.updateItems(
      trackerItems.map((init) => init.id),
      (items) => {
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            metadata.active = i === nextIndex;
          }
        }
      }
    );
  }

  function handleTrackerCountChange(id: string, newCount: string) {
    // Set local items immediately
    setTrackerItems((prev) =>
      prev.map((tracker) => {
        if (tracker.id === id) {
          return {
            ...tracker,
            count: newCount,
          };
        } else {
          return tracker;
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[getPluginId("metadata")];
        if (isMetadata(metadata)) {
          metadata.count = newCount;
        }
      }
    });
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

  return (
    <Stack height="100vh">
      <TrackerHeader
        subtitle={
          trackerItems.length === 0
            ? "Select a character to start tracker"
            : undefined
        }
        action={
          <IconButton
            aria-label="next"
            onClick={handleNextClick}
            disabled={trackerItems.length === 0}
          >
            <SkipNextRounded />
          </IconButton>
        }
      />
      <Box sx={{ overflowY: "auto" }}>
        <List ref={listRef}>
          {trackerItems
            .sort((a, b) => parseFloat(b.count) - parseFloat(a.count))
            .map((tracker) => (
              <TrackerListItem
                key={tracker.id}
                tracker={tracker}
                onCountChange={(newCount) => {
                  handleTrackerCountChange(tracker.id, newCount);
                }}
                showHidden={role === "GM"}
              />
            ))}
        </List>
      </Box>
    </Stack>
  );
}
