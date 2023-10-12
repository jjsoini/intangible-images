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
        title="Toggle clickthrough"
        action={action}
        titleTypographyProps={{
          sx: {
            fontSize: "0.9rem",
            fontWeight: "bold",
            lineHeight: "32px",
            color: "text.primary",
          },
        }}
      />
      
      
      <Divider variant="middle" />
      {subtitle && (
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: "inline-block",
            color: "text.secondary",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
}
