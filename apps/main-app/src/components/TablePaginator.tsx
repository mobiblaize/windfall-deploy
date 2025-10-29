import { Button, Flex, Group, Text } from "@mantine/core";

interface PaginatorProps {
  currentPage: number;
  total: number;
  pageSize: number;
  onPageChange?: (newPage: number) => void;
  isLoading?: boolean;
}

export default function TablePaginator({
  currentPage,
  isLoading = false,
  total,
  pageSize,
  onPageChange,
}: PaginatorProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize)) || 0;
  return (
    <Flex
      my="md"
      justify="space-between"
      gap={2}
      wrap="wrap"
      px="lg"
      align="center"
    >
      <Text>
        Page {currentPage} of {totalPages}
      </Text>
      <Group>
        <Button
          variant="outline"
          className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() =>
            currentPage < totalPages && onPageChange?.(currentPage + 1)
          }
        >
          Next
        </Button>
      </Group>
    </Flex>
  );
}
