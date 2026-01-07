import { useState } from "react";
import Heading from "../ui/Heading";
import MaintenanceTable from "../features/maintenance/MaintenanceTable";
import MaintenanceKanban from "../features/maintenance/MaintenanceKanban";
import { useMaintenanceTickets } from "../features/maintenance/useMaintenanceTickets";
import { useMaintenanceSubscription } from "../features/maintenance/useMaintenanceSubscription";
import Row from "../ui/Row";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CreateTicketForm from "../features/maintenance/CreateTicketForm";
import TicketDetail from "../features/maintenance/TicketDetail";
import ButtonGroup from "../ui/ButtonGroup";
import { HiListBullet, HiSquares2X2 } from "react-icons/hi2";
import MaintenanceTableOperations from "../features/maintenance/MaintenanceTableOperations";

function Maintenance() {
  const [view, setView] = useState("table");
  // State to hold view
  useMaintenanceSubscription(); 

  return (
    <Modal>
      <Row type="horizontal">
        <Heading as="h1">Maintenance Requests</Heading>
        <div style={{display:'flex', gap:'1rem', alignItems: 'center'}}>
            <MaintenanceTableOperations />
            <ButtonGroup>
                <Button size="small" variation={view === 'table' ? 'primary' : 'secondary'} onClick={() => setView('table')}>
                    <HiListBullet />
                </Button>
                <Button size="small" variation={view === 'board' ? 'primary' : 'secondary'} onClick={() => setView('board')}>
                    <HiSquares2X2 />
                </Button>
            </ButtonGroup>
        </div>
      </Row>

      <Row type="horizontal">
         <Modal.Open opens="ticket-form">
             <Button>Report Issue</Button>
         </Modal.Open>
      </Row>

      <Modal.Window name="ticket-form">
          <CreateTicketForm />
      </Modal.Window>
       
       {view === 'table' && <MaintenanceTable />}
       {view === 'board' && <MaintenanceKanban />}
    </Modal>
  );
}

export default Maintenance;
