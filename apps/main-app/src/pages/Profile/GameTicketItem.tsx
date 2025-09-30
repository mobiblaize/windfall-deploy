import GamesTicketModal from "../../components/Modals/GamesTicketModal";
import { useState } from "react";
import GameTicket from "./GameTicket";
import type { OrderTicket } from "./GamesTickets";
import type { Raffle } from "../../models/raffles";

type Props = {
  item: OrderTicket;
  game: Raffle;
  status?: "won" | "lost";
  containerBgColor?: string;
  handleClick?: () => void;
};

function GameTicketItem({ item, game }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <GameTicket game={game} handleClick={() => {setModalOpen(true)}} item={item} />
      <GamesTicketModal
        game={game}
        item={item}
        isOpened={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default GameTicketItem;
