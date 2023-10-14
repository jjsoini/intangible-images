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
            fontSize: "0.8rem",
            fontWeight: "normal",
            lineHeight: "1.5",
            marginTop: "6px",
            color: "text.secondary",
            letterSpacing: "0.02em",
          },
        }}
      />
    </>
  );
}
