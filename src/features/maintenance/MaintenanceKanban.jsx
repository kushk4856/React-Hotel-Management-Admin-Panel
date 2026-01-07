import styled from "styled-components";
import { useMaintenanceTickets } from "./useMaintenanceTickets";
import Spinner from "../../ui/Spinner";
import Tag from "../../ui/Tag";
import Modal from "../../ui/Modal";
import TicketDetail from "./TicketDetail";

const Board = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2.4rem;
  margin-top: 2rem;
  overflow-x: auto;
  height: calc(100vh - 25rem);
`;

const Column = styled.div`
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-grey-600);
`;

const TicketCard = styled.div`
  background-color: var(--color-grey-0);
  padding: 1.6rem;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-grey-100);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const CardTitle = styled.h4`
    font-size: 1.4rem;
    font-weight: 600;
`;

const CardMeta = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    color: var(--color-grey-500);
`;

const PriorityBadge = styled.span`
  background-color: ${props => props.type === 'high' ? 'var(--color-red-100)' : 'var(--color-blue-100)'};
  color: ${props => props.type === 'high' ? 'var(--color-red-700)' : 'var(--color-blue-700)'};
  padding: 0.2rem 0.8rem;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
`;

function MaintenanceKanban() {
  const { tickets, isLoading } = useMaintenanceTickets();

  if (isLoading) return <Spinner />;

  // Group tickets by status
  const openTickets = tickets?.filter(t => t.status === 'open') || [];
  const inProgressTickets = tickets?.filter(t => t.status === 'in_progress') || [];
  const resolvedTickets = tickets?.filter(t => t.status === 'resolved') || [];

  const renderColumn = (columnTitle, tickets, tagColor) => (
      <Column>
            <ColumnHeader>
                <span>{columnTitle}</span>
                <Tag type={tagColor}>{tickets.length}</Tag>
            </ColumnHeader>
            {tickets.map(ticket => (
                <Modal key={ticket.id}>
                    <Modal.Open opens="ticket-detail">
                        <TicketCard>
                            <CardMeta>
                                <span>Room {ticket.cabins?.name || "?"}</span>
                                {ticket.priority && <PriorityBadge type={ticket.priority || 'low'}>{ticket.priority}</PriorityBadge>}
                            </CardMeta>
                            <CardTitle>{ticket.description}</CardTitle>
                            <CardMeta>
                                {ticket.profiles?.full_name || "Staff"}
                            </CardMeta>
                        </TicketCard>
                    </Modal.Open>
                    <Modal.Window name="ticket-detail">
                        <TicketDetail ticket={ticket} />
                    </Modal.Window>
                </Modal>
            ))}
      </Column>
  );

  return (
    <Board>
        {renderColumn("No Access / Open", openTickets, "red")}
        {renderColumn("In Progress", inProgressTickets, "blue")}
        {renderColumn("Resolved / Verify", resolvedTickets, "green")}
    </Board>
  );
}

export default MaintenanceKanban;
