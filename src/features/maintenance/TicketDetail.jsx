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
import { HiCheckCircle, HiClock, HiUser, HiChatBubbleLeftRight } from "react-icons/hi2";
import { updateCabinStatus } from "../../services/apiCabins"; 
import WorkflowAction from "./WorkflowAction";

// --- STYLES ---
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 65rem;
  max-height: 85vh;
  overflow-y: auto;
  padding: 1rem; 
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

// --- TIMELINE STYLES ---
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
  border-left: 2px solid var(--color-brand-200);
  padding-left: 2rem;
  gap: 2rem;
`;

const TimelineItemWrapper = styled.div`
  position: relative;
`;

const TimelineDot = styled.div`
  position: absolute;
  left: -2.9rem; /* Adjust based on padding of parent */
  top: 0;
  background-color: var(--color-brand-100);
  color: var(--color-brand-600);
  padding: 0.4rem;
  border-radius: 50%;
  border: 2px solid var(--color-grey-0);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimelineContent = styled.div`
  background: var(--color-grey-50);
  padding: 1.2rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-100);
`;

const TimelineTitle = styled.h4`
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
    color: var(--color-grey-700);
    display: flex;
    align-items: center;
    gap: 0.8rem;
`;

const TimelineText = styled.p`
    font-size: 1.3rem;
    color: var(--color-grey-600);
    white-space: pre-wrap;
    line-height: 1.4;
`;

const statusToColor = {
    new: 'red',
    approved: 'yellow',
    in_progress: 'blue',
    resolved: 'green',
    closed: 'silver'
};

// Helper: Parse description log
function parseJourney(description, created_at, reporter) {
    if (!description) return [];

    const steps = [{
        title: "Ticket Created",
        content: description.split('\n[')[0], // First block
        icon: <HiClock />,
        date: created_at,
        actor: reporter
    }];
    
    // Regex to find appended logs like \n[Tag]: Content
    const regex = /\[(.*?)\]:\s(.*)/;
    const lines = description.split('\n');
    
    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            let icon = <HiChatBubbleLeftRight />;
            if (match[1].includes('Resolved') || match[1].includes('Verified')) icon = <HiCheckCircle />;
            if (match[1].includes('User')) icon = <HiUser />;

            steps.push({
                title: match[1], 
                content: match[2], 
                icon: icon,
                // treating as update without specific date for now
            });
        }
    });
    
    return steps;
}

function TicketDetail({ ticket, onCloseModal }) {
  const { updateTicket, isUpdating } = useUpdateTicket();
  const { role, user } = useUser(); 
  const isManager = role === 'manager' || role === 'admin';
  const queryClient = useQueryClient();
  
  // Local state
  const [priority, setPriority] = useState(ticket?.priority || 'low');
  const [assignee, setAssignee] = useState(ticket?.assigned_to || ''); 
  const [outOfService, setOutOfService] = useState(ticket?.cabins?.is_out_of_service || false); 
  const [note, setNote] = useState('');
  
  if (!ticket) return <Spinner />;

  // --- Handlers ---
  const handleApprove = () => {
      const updates = { 
          id: ticket.id, 
          status: 'approved', 
          priority,
          description: ticket.description + `\n[Updated]: High Priority assigned by Manager` 
      };
      
      if (outOfService && ticket.cabin_id) {
          updateCabinStatus(ticket.cabin_id, true)
            .then(() => queryClient.invalidateQueries({ queryKey: ["cabins"] }))
            .catch(err => console.error(err));
      }
      updateTicket(updates);
  };

  const handleAssign = () => {
      updateTicket({ 
          id: ticket.id, 
          status: 'in_progress', 
          assigned_to: assignee || user.id,
          description: ticket.description + `\n[Updated]: Assigned to ${assignee || user.user_metadata?.fullName || 'Technician'}`
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
             .then(() => queryClient.invalidateQueries({ queryKey: ["cabins"] }))
             .catch(err => console.error(err));
      }
  };

  const currentStatus = ticket.status;

  return (
    <ModalContent>
        <Heading as="h2">Maintenance Journey #{ticket.id}</Heading>

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
                <Label>Date Created</Label>
                <Value>{new Date(ticket.created_at).toLocaleDateString()}</Value>
            </DetailRow>
        </div>

        {/* TIMELINE VIEW */}
        <Heading as="h3">Ticket Timeline</Heading>
        <Timeline>
            {parseJourney(ticket.description, ticket.created_at, ticket.profiles?.full_name).map((step, i) => (
                <TimelineItemWrapper key={i}>
                    <TimelineDot>
                         {step.icon}
                    </TimelineDot>
                    <TimelineContent>
                        <TimelineTitle>{step.title}</TimelineTitle>
                        <TimelineText>{step.content}</TimelineText>
                        {step.date && <span style={{fontSize:'1.1rem', color:'grey'}}>{new Date(step.date).toLocaleString()} by {step.actor}</span>}
                    </TimelineContent>
                </TimelineItemWrapper>
            ))}
        </Timeline>
        
        {/* WORKFLOW ACTIONS (Next Steps) */}
        {currentStatus === 'new' && isManager && (
            <WorkflowAction title="Next Step: Triage Application">
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
             <WorkflowAction title="Next Step: Assign Technician">
                 <InputGroup>
                     <Label>Assign To (Staff ID/Name)</Label>
                     <StyledInput placeholder="e.g. John Doe (Tech)" value={assignee} onChange={e=>setAssignee(e.target.value)} />
                 </InputGroup>
                 <Button onClick={handleAssign} disabled={isUpdating}>Assign & Start Work</Button>
             </WorkflowAction>
        )}

        {(currentStatus === 'in_progress' || currentStatus === 'approved') && (
            <WorkflowAction title="Next Step: Work Execution">
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
             <WorkflowAction title="Next Step: Verification" variation="warning">
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
            <WorkflowAction title="Next Step: Final Closure">
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
