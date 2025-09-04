import { Button, Flex, Group, Text } from "@mantine/core";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (newPage: number) => void;
}

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
}: PaginatorProps) {

  return (
    <Flex my="md" justify="space-between" gap={2} wrap="wrap" px="lg" align="center">
                <Text>Page {currentPage} of {totalPages}</Text>
                <Group>
                  <Button
                    variant="outline"
                    className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
                    disabled={currentPage === 1}
                    onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
                    disabled={currentPage === totalPages}
                    onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
                  >
                    Next
                  </Button>
                </Group>
              </Flex>
  );
}
