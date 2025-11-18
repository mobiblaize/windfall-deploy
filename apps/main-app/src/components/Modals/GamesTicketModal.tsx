import { Modal, Button, Flex } from "@mantine/core";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { BsTrophyFill } from "react-icons/bs";
import AlertModal from "./AlertModal";
import { useState } from "react";
import GameTicket from "../../pages/Profile/GameTicket";
import type { OrderTicket } from "../../pages/Profile/GamesTickets";
import type { Raffle } from "../../models/raffles";
import { notifications } from "@mantine/notifications";
import { useGetExportData } from "../../utils/hooks/useApis";

type Props = {
  item: OrderTicket;
  game: Raffle;
  isOpened?: boolean;
  onClose: () => void;
};

export default function GamesTicketModal({
  item,
  game,
  isOpened = false,
  onClose,
}: Props) {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const downloadTicketMutation = useGetExportData(
    `customer/games/ticket/download-single-ticket-file/${item.uuid}`
  );

  const downloadTicket = () => {
    downloadTicketMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${item.ticket_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        notifications.show({
          title: "Download Successful",
          message: "Your file has been downloaded",
          color: "green",
        });

        setSuccessModalOpen(true);
      },
      onError: (error) => {
        notifications.show({
          title: "Download Failed",
          message: error?.message || "An error occurred",
          color: "var(--color-primary-red)",
        });
      },
    });
  };

  return (
    <>
      <Modal
        opened={isOpened}
        onClose={onClose}
        centered
        size="lg"
        className="!rounded-2xl !text-primary-text"
        classNames={{ content: "!rounded-3xl" }}
      >
        <div className="mx-7">
          <GameTicket
            status="won"
            game={game}
            item={item}
            containerBgColor="bg-white"
          />
        </div>

        <Flex gap={20} my="lg" mx="xl">
          <Button
            onClick={downloadTicket}
            disabled={downloadTicketMutation.isPending}
            loading={downloadTicketMutation.isPending}
            rightSection={
              <HiDocumentArrowDown className="text-secondary-red/90" />
            }
            className="!w-full !border-2 !border-dashed !border-secondary-red !h-12 !text-lg !tracking-wide"
          >
            Download Ticket
          </Button>
          <Button
            className="!bg-primary-text !w-full !h-12 !text-lg !tracking-wide"
            rightSection={<BsTrophyFill />}
          >
            Claim Prize
          </Button>
        </Flex>
      </Modal>

      <AlertModal
        opened={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        status="success"
        title="Raffle Ticket Downloaded"
        description="Congratulations you have successfully downloaded your Raffle Ticket."
      />
    </>
  );
}
