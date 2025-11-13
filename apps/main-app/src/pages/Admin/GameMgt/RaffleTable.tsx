import {
  ActionIcon,
  Badge
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import type { Raffle } from "./RaffleList";
import { GoArrowUpRight } from "react-icons/go";
import DynamicTableSection from "../../../components/DynamicTableSection";
import { format } from "date-fns";
import { colorMap } from "../../../models/raffles";
import CustomBadge from "../../../components/CustomBadge";
type RaffleTableProps = {
  raffles: Raffle[];
  isLoading: boolean;
  baseRoute?: string;
}


export default function RaffleTable( { isLoading, raffles, baseRoute = "/admin/raffles" }: RaffleTableProps) {
  const navigate = useNavigate();
  return (
    <DynamicTableSection
      headers={[
        { label: "Raffle Name", key: "name" },
        { label: "Raffle Category", key: "category" },
        { label: "Date Created", key: "date" },
        { label: "Raffle Duration", key: "duration" },
        { label: "Raffle Status", key: "main_active_status" },
        { label: "Approval Status", key: "status" },
        { label: "", key: "action" },
      ]}
      data={raffles}
      loading={isLoading}
      renderItems={(raffle: Raffle) => {
        // Calculate days between start_date and end_date
        let duration = "-";
        if (raffle.start_date && raffle.end_date) {
          const start = new Date(raffle.start_date);
          const end = new Date(raffle.end_date);
          duration = `${format(start, "MMMM d, yyyy")} - ${format(end, "MMMM d, yyyy")}`;
        }
        else if (raffle.instant_game === "true") duration = "Instant Game";
        return [
          raffle.name,
          raffle.category.name,
          raffle?.created_at
            ? format(new Date(raffle.created_at), "MMMM d, yyyy")
            : "-",
          duration,
          <Badge
            color={colorMap[raffle.main_active_status]?.bg}
            radius="md"
            className="!capitalize !text-sm !h-[22px]"
            variant="light"
          >
            {raffle.main_active_status}
          </Badge>,

          <CustomBadge
            status={
              raffle.approvalStatus === "approved"
                ? "successful"
                : raffle.approvalStatus === "pending"
                  ? "pending"
                  : "failed"
            }
            label={raffle.approvalStatus}
          />,
          <ActionIcon
            onClick={() => navigate(`${baseRoute}/${raffle.uuid}`)}
            size={35}
            className="!bg-[#FFD5D6] !text-primary-red !text-xl"
          >
            <GoArrowUpRight />
          </ActionIcon>,
        ];
      }}
    />
  );
}
