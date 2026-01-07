import { useSearchParams } from "react-router-dom";
import { useMaintenanceTickets } from "./useMaintenanceTickets";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Tag from "../../ui/Tag";
import Empty from "../../ui/Empty";
import Modal from "../../ui/Modal";
import TicketDetail from "./TicketDetail";
import styled from "styled-components";
import Menus from "../../ui/Menus";
import { HiEye } from "react-icons/hi2";
import Button from "../../ui/Button";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  
  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
      color: var(--color-grey-500);
      font-size: 1.2rem;
  }
`;

function MaintenanceTable() {
  const { tickets, isLoading } = useMaintenanceTickets();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!tickets?.length) return <Empty resourceName="tickets" />;

  // 1. FILTER
  const filterValue = searchParams.get("status") || "all";

  let filteredTickets;
  if (filterValue === "all") filteredTickets = tickets;
  else filteredTickets = tickets.filter((ticket) => ticket.status === filterValue);

  // 2. SORT
  const sortBy = searchParams.get("sortBy") || "created_at-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedTickets = filteredTickets.sort((a, b) => {
      // Handle Date sorting specifically
      if (field === 'created_at') {
          return (new Date(a[field]) - new Date(b[field])) * modifier;
      }
      // Handle Priority sorting (custom order)
      if (field === 'priority') {
          const priorityWeight = { low: 1, medium: 2, high: 3, critical: 4 };
          // If we want high first (desc): 4 - 1
          return (priorityWeight[a.priority] - priorityWeight[b.priority]) * modifier;
      }
      return 0; 
  });

  const statusToTagName = {
    new: "red",
    open: "red", 
    approved: "yellow",
    in_progress: "blue",
    resolved: "green",
    verified: "green",
    closed: "silver",
    rejected: "grey"
  };

  return (
    <Menus>
    <Table columns="1.2fr 2fr 1.2fr 1fr 1fr 3.2rem">
      <Table.Header>
        <div>Cabin</div>
        <div>Description</div>
        <div>Reported By</div>
        <div>Date</div>
        <div>Status</div>
        <div></div>
      </Table.Header>

      <Table.Body
        data={sortedTickets}
        render={(ticket) => (
          <Modal key={ticket.id}>
             <Table.Row>
                <Stacked>
                    <span>{ticket.cabins?.name || "Unknown"}</span>
                </Stacked>

                <div>
                    <span style={{ 
                        display: 'inline-block', 
                        maxWidth: '20ch', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        marginRight: '1rem',
                        verticalAlign: 'middle'
                    }}>
                        {ticket.description.split('\n')[0]}
                    </span>
                    <Modal.Open opens="ticket-detail">
                        <Button size="small" variation="secondary">See Details</Button>
                    </Modal.Open>
                </div>

                <div>{ticket.profiles?.full_name || "Staff"}</div>

                <Stacked>
                   <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                </Stacked>

                <Tag type={statusToTagName[ticket.status]}>
                   {ticket.status.replace("_", " ")}
                </Tag>
                
                 <Menus.Menu>
                     <Menus.Toggle id={ticket.id} />
                     <Menus.List id={ticket.id}>
                        <Modal.Open opens="ticket-detail">
                            <Menus.Button icon={<HiEye />}>View Details</Menus.Button>
                        </Modal.Open>
                     </Menus.List>
                 </Menus.Menu>

             </Table.Row>

             <Modal.Window name="ticket-detail">
                 <TicketDetail ticket={ticket} />
             </Modal.Window>
          </Modal>
        )}
      />
    </Table>
    </Menus>
  );
}

export default MaintenanceTable;
