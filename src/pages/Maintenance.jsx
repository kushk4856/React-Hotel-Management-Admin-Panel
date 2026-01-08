import { useState } from "react";
import Heading from "../ui/Heading";
import MaintenanceTable from "../features/maintenance/MaintenanceTable";
import MaintenanceKanban from "../features/maintenance/MaintenanceKanban";
import { useMaintenanceSubscription } from "../features/maintenance/useMaintenanceSubscription";
import Row from "../ui/Row";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CreateTicketForm from "../features/maintenance/CreateTicketForm";
import ButtonGroup from "../ui/ButtonGroup";
import { HiListBullet, HiSquares2X2 } from "react-icons/hi2";
import MaintenanceTableOperations from "../features/maintenance/MaintenanceTableOperations";
import styled from "styled-components";
const OperationsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

function Maintenance() {
  const [view, setView] = useState("table");
  // State to hold view
  useMaintenanceSubscription(); 

  return (
    <Modal>
      <Row type="horizontal">
        <Heading as="h1">Maintenance Requests</Heading>
        <OperationsContainer>
            <MaintenanceTableOperations />
            <ButtonGroup>
                <Button size="small" variation={view === 'table' ? 'primary' : 'secondary'} onClick={() => setView('table')}>
                    <HiListBullet />
                </Button>
                <Button size="small" variation={view === 'board' ? 'primary' : 'secondary'} onClick={() => setView('board')}>
                    <HiSquares2X2 />
                </Button>
            </ButtonGroup>
        </OperationsContainer>
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
