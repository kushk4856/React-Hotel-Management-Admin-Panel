/* eslint-disable react/prop-types */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import Tag from "../../ui/Tag";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import { useUpdateTicket } from "./useUpdateTicket";
import { useUser } from "../authentication/useUser";
import { HiCheckCircle } from "react-icons/hi2";
import { updateCabinStatus } from "../../services/apiCabins"; 
import WorkflowAction from "./WorkflowAction";

// Styles
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 60rem;
  max-height: 80vh;
  overflow-y: auto;
`;

const DetailRow = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-grey-100);
  padding-bottom: 1.2rem;
  align-items: center;
`;

const Label = styled.span`
  font-weight: 500;
  color: var(--color-grey-500);
`;

const Value = styled.span`
  font-weight: 600;
  color: var(--color-grey-800);
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
`;

const StyledInput = styled.input`
  font-size: 1.4rem;
  padding: 0.8rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
`;

const TextArea = styled.textarea`
  font-size: 1.4rem;
  padding: 0.8rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  min-height: 8rem;
`;

const statusToColor = {
    new: 'red',
    approved: 'yellow',
    in_progress: 'blue',
    resolved: 'green',
    closed: 'silver'
};

function TicketDetail({ ticket, onCloseModal }) {
  const { updateTicket, isUpdating } = useUpdateTicket();
  const { role, user } = useUser(); 
  const isManager = role === 'manager';
  const queryClient = useQueryClient();
  
  // Local state
  const [priority, setPriority] = useState(ticket.priority || 'low');
  const [assignee, setAssignee] = useState(ticket.assigned_to || ''); 
  const [outOfService, setOutOfService] = useState(ticket.cabins?.is_out_of_service || false); 
  const [note, setNote] = useState('');
  
  if (!ticket) return <Spinner />;

  // --- Handlers ---
  const handleApprove = () => {
      const updates = { 
          id: ticket.id, 
          status: 'approved', 
          priority 
      };
      
      if (outOfService && ticket.cabin_id) {
          updateCabinStatus(ticket.cabin_id, true)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["cabins"] });
            })
            .catch(err => console.error(err));
      }
      updateTicket(updates);
  };

  const handleAssign = () => {
      updateTicket({ 
          id: ticket.id, 
          status: 'in_progress', 
          assigned_to: assignee || user.id 
      });
  };

  const handleResolve = () => {
      updateTicket({
          id: ticket.id,
          status: 'resolved',
          image: ticket.image, 
          description: ticket.description + `\n[Resolved]: ${note}`
      });
  };

  const handleVerify = (passed) => {
      if (passed) {
           if (ticket.description?.includes("[Verified]:")) return; 
           updateTicket({
              id: ticket.id,
              description: ticket.description + `\n[Verified]: Fix confirmed by ${user.user_metadata?.fullName || 'Staff'}`
           });
      } else {
           updateTicket({
              id: ticket.id,
              status: 'in_progress',
              description: ticket.description + `\n[Verification Failed]: ${note}`
           });
      }
  };

  const handleClose = () => {
      updateTicket({
          id: ticket.id,
          status: 'closed'
      });
      const restoreRoom = document.getElementById("restore")?.checked;
      if (restoreRoom && ticket.cabin_id) {
           updateCabinStatus(ticket.cabin_id, false)
             .then(() => {
                 queryClient.invalidateQueries({ queryKey: ["cabins"] });
             })
             .catch(err => console.error(err));
      }
  };

  // --- RENDER HELPERS ---
  const currentStatus = ticket.status;

  return (
    <ModalContent>
        <Heading as="h2">Maintenance Ticket #{ticket.id}</Heading>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem'}}>
            <DetailRow>
                <Label>Location</Label>
                <Value>{ticket.cabins?.name || "Unknown"}</Value>
            </DetailRow>
            <DetailRow>
                <Label>Current Status</Label>
                <Tag type={statusToColor[currentStatus] || 'grey'}>
                    {currentStatus.replace("_", " ").toUpperCase()}
                </Tag>
            </DetailRow>
            <DetailRow>
                <Label>Reported By</Label>
                <Value>{ticket.profiles?.full_name || "Staff"}</Value>
            </DetailRow>
             <DetailRow>
                <Label>Date</Label>
                <Value>{new Date(ticket.created_at).toLocaleDateString()}</Value>
            </DetailRow>
        </div>

        <div>
            <Label>Issue Description:</Label>
            <p style={{marginTop:'0.8rem', padding:'1rem', backgroundColor:'var(--color-grey-100)', borderRadius:'var(--border-radius-sm)', whiteSpace: 'pre-wrap'}}>
                {ticket.description}
            </p>
        </div>
        
        {currentStatus === 'new' && isManager && (
            <WorkflowAction title="Step 1: Triage Application">
                <InputGroup>
                    <Label>Set Priority</Label>
                    <StyledSelect value={priority} onChange={e=>setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </StyledSelect>
                </InputGroup>
                <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                   <input type="checkbox" checked={outOfService} onChange={e=>setOutOfService(e.target.checked)} id="oos" />
                   <label htmlFor="oos" style={{fontSize:'1.4rem'}}>Mark Room Out of Service</label>
                </div>
                <Button onClick={handleApprove} disabled={isUpdating}>Approve & Prioritize</Button>
            </WorkflowAction>
        )}

        {currentStatus === 'approved' && isManager && (
             <WorkflowAction title="Step 2: Assign Technician">
                 <InputGroup>
                     <Label>Assign To (Staff ID/Name)</Label>
                     <StyledInput placeholder="e.g. John Doe (Tech)" value={assignee} onChange={e=>setAssignee(e.target.value)} />
                 </InputGroup>
                 <Button onClick={handleAssign} disabled={isUpdating}>Assign & Start Work</Button>
             </WorkflowAction>
        )}

        {(currentStatus === 'in_progress' || currentStatus === 'approved') && (
            <WorkflowAction title="Step 3: Work Execution">
                <InputGroup>
                    <Label>Resolution Note</Label>
                    <TextArea placeholder="What was fixed? Parts used?" value={note} onChange={e=>setNote(e.target.value)} />
                </InputGroup>
                <Button onClick={handleResolve} disabled={isUpdating}>
                    <HiCheckCircle /> Mark Resolved
                </Button>
            </WorkflowAction>
        )}

        {currentStatus === 'resolved' && (
             <WorkflowAction title="Step 4: Verification Needed" variation="warning">
                {ticket.description?.includes("[Verified]:") ? (
                    <div style={{display:'flex', alignItems:'center', gap:'1rem', color:'green', fontWeight:'bold'}}>
                        <HiCheckCircle size={24} />
                        <span>Verification Logged. Waiting for Manager to Close.</span>
                    </div>
                ) : (
                    <>
                    <p>Please check the room. Is the issue fixed?</p>
                    <div style={{display:'flex', gap:'1rem'}}>
                        <Button variation="secondary" onClick={() => handleVerify(false)} disabled={isUpdating}>
                            Not Fixed (Reopen)
                        </Button>
                        <Button variation="primary" onClick={() => handleVerify(true)} disabled={isUpdating}>
                            <HiCheckCircle /> Confirm Fixed
                        </Button>
                    </div>
                    </>
                )}
            </WorkflowAction>
        )}

        {currentStatus === 'resolved' && isManager && (
            <WorkflowAction title="Step 5: Final Closure">
                 <p>Housekeeping verification Pending/Passed. Ready to close?</p>
                 <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom: '1rem'}}>
                   <input type="checkbox" id="restore" defaultChecked />
                   <label htmlFor="restore" style={{fontSize:'1.4rem'}}>Put Room Back in Service</label>
                </div>
                 <Button variation="danger" onClick={handleClose} disabled={isUpdating}>Close Ticket</Button>
            </WorkflowAction>
        )}

        {currentStatus === 'closed' && (
             <WorkflowAction title="Ticket Closed">
                 <p>This ticket is closed and archived.</p>
             </WorkflowAction>
        )}
        
        <div style={{display:'flex', justifyContent:'flex-end'}}>
             <Button variation="secondary" onClick={onCloseModal}>Close View</Button>
        </div>

    </ModalContent>
  );
}

export default TicketDetail;
