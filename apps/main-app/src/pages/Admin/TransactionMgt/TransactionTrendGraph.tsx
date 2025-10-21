import { Card, Text, Skeleton } from "@mantine/core";
import { PiQuestionThin } from "react-icons/pi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { MonthlyTransactionCount } from "./TransactionDashboard";

type TransactionTrendGraphProps = {
  graphData?: Record<string, MonthlyTransactionCount>;
  isLoading?: boolean;
  error?: string | null;
};

export default function TransactionTrendGraph({
  graphData,
  isLoading = false,
  error = null,
}: TransactionTrendGraphProps) {
  // Convert graphData object into recharts-friendly array
  const formattedData = graphData
    ? Object.entries(graphData).map(([monthKey, value]) => {
        // Convert YYYY-MM to readable month format
        const [year, month] = monthKey.split("-");
        const date = new Date(Number(year), Number(month) - 1);
        const formattedMonth = date.toLocaleString("en-US", {
          month: "short",
          year: "2-digit",
        });

        return {
          month: formattedMonth,
          website: value.web_transactions,
          mobile: value.mobile_transactions,
        };
      })
    : [];

  return (
    <Card withBorder radius="md" className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <Text fw={600} fz="sm" className="flex items-center gap-2">
          Transaction Trend
          <PiQuestionThin className="text-gray-400" />
        </Text>
      </div>

      {isLoading ? (
        <Skeleton height={320} radius="md" />
      ) : error ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          Failed to load data: {error}
        </div>
      ) : (
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis
                label={{
                  value: "No. of Transactions",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
                tickCount={6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="left"
                iconType="circle"
                wrapperStyle={{ paddingTop: "16px" }}
              />
              <Bar
                dataKey="website"
                stackId="transactions"
                fill="#D32F2F"
                name="Website"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="mobile"
                stackId="transactions"
                fill="#FF8A80"
                name="Mobile App"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Graph Legend */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <Text fw={600} fz="sm" mb={8}>
          Graph Legend
        </Text>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#D32F2F]"></span>
            <Text fz="sm">Website</Text>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#FF8A80]"></span>
            <Text fz="sm">Mobile App</Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
