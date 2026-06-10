import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../components/customTable/CustomTable";

const DashboardTableCard = ({
  title,
  navigatePath,
  data,
  tableHead,
  show = false,
}) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <CustomTable
          data={data || []}
          TABLE_HEAD={tableHead || []}
          pagePagination={false}
          is_hide={true}
          hide_footer_pagination={true}
          className={"dashboard-table"}
        />
      </CardContent>
    </Card>
  );
};

export default DashboardTableCard;
