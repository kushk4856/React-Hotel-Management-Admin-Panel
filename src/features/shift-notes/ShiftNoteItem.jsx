/* eslint-disable react/prop-types */
import styled from "styled-components";
import Tag from "../../ui/Tag";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import { HiCheckCircle, HiClipboardDocumentCheck } from "react-icons/hi2";
import { useUser } from "../authentication/useUser";
import { useAcknowledgeNote } from "./useShiftNotes";
import Modal from "../../ui/Modal";
import CreateTaskForm from "../housekeeping/CreateTaskForm";

const NoteCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  margin-bottom: 2rem;
  position: relative;
  
  ${props => props.$status === 'posted' && `
    border-left: 5px solid var(--color-brand-500);
  `}

  ${props => props.$status === 'acknowledged' && `
    border-left: 5px solid var(--color-green-500);
    opacity: 0.9;
  `}
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.6rem;
`;

const SectionBox = styled.div`
  background-color: var(--color-grey-50);
  padding: 1.2rem;
  border-radius: var(--border-radius-sm);
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h5`
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-grey-500);
    margin-bottom: 0.4rem;
`;

const AckBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--color-green-600);
    font-weight: 600;
    font-size: 1.2rem;
    margin-top: 1rem;
`;

const TaskBadge = styled.div`
    background-color: var(--color-brand-100);
    color: var(--color-brand-700);
    padding: 0.4rem 0.8rem;
    border-radius: var(--border-radius-sm);
    font-size: 1.2rem;
    font-weight: 600;
    margin-left: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
`;

function ShiftNoteItem({ note }) {
    const { user } = useUser();
    const { acknowledge, isAcknowledging } = useAcknowledgeNote();
    const isManager = user?.role === 'manager' || user?.role === 'admin';
    
    // Parse Date safely
    const createdDate = new Date(note.created_at);
    const linkedTasksCount = note.housekeeping_tasks?.length || 0;
    
    function handleAck() {
        acknowledge({ id: note.id, userId: user.id });
    }
    return (
        <NoteCard $status={note.status}>
            <NoteHeader>
                <div>
                   <Heading as="h3">
                       {note.shift} Shift Handover
                       {linkedTasksCount > 0 && (
                           <TaskBadge>
                               <HiClipboardDocumentCheck /> {linkedTasksCount} task(s) created
                           </TaskBadge>
                       )}
                   </Heading> 
                   <span style={{color:'var(--color-grey-500)'}}>
                        {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()} by {note.profiles?.full_name || 'Staff'}
                   </span>
                </div>
                <Tag type={note.status === 'posted' ? 'blue' : 'green'}>
                    {note.status.toUpperCase()}
                </Tag>
            </NoteHeader>
            
            <p style={{fontSize:'1.6rem', marginBottom:'2rem'}}>{note.note}</p>

            <div style={{display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap:'1rem'}}>
               {note.sections?.pending_rooms && (
                   <SectionBox>
                       <SectionTitle>Pending Rooms</SectionTitle>
                       <p>{note.sections.pending_rooms}</p>
                   </SectionBox>
               )}
               {note.sections?.maintenance && (
                   <SectionBox>
                       <SectionTitle>Maintenance</SectionTitle>
                       <p>{note.sections.maintenance}</p>
                   </SectionBox>
               )}
               {note.sections?.low_stock && (
                   <SectionBox>
                       <SectionTitle>Low Stock</SectionTitle>
                       <p>{note.sections.low_stock}</p>
                   </SectionBox>
               )}
            </div>

            <div style={{marginTop:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                {isManager && (
                   <Modal>
                       <Modal.Open opens="create-task">
                           <Button size="small" variation="secondary">Create Follow-up Task</Button>
                       </Modal.Open>
                       <Modal.Window name="create-task">
                           <CreateTaskForm shiftNoteId={note.id} />
                       </Modal.Window>
                   </Modal>
                )}

                {note.status === 'posted' && isManager && (
                   <Button onClick={handleAck} disabled={isAcknowledging}>
                      <HiCheckCircle /> Acknowledge Handover
                   </Button>
                )}
            </div>

            {note.status === 'acknowledged' && (
                <AckBadge>
                    <HiCheckCircle /> 
                    Acknowledged by {note.ack_profile?.full_name || 'Manager'} 
                    at {new Date(note.acknowledged_at).toLocaleString()}
                </AckBadge>
            )}
        </NoteCard>
    );
}

export default ShiftNoteItem;
