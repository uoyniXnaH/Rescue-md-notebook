import { Box, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

function BlankPage() {
  const { t } = useTranslation();

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h4" color="info.contrastText" sx={{userSelect: "none"}}>{t("blank_prompt")}</Typography>
    </Box>
  );
}

export default BlankPage;