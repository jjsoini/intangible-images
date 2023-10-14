import React from "react";
import Switch from '@mui/material/Switch';

import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const switchLabel = { inputProps: { 'aria-label': 'Switch demo' } };

export function TrackerHeader({
  subtitle,
  action,
}: {
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <>
      <CardHeader
        title={subtitle}
        action={action}
        titleTypographyProps={{
          sx: {
            fontSize: "0.75rem",
            fontWeight: "normal",
            lineHeight: "1.5",
            color: "text.secondary",
            letterSpacing: "0.02em",
          },
        }}
      />
    </>
  );
}
