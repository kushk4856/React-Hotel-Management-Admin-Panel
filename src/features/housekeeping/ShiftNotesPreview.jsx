import styled from "styled-components";
import { useShiftNotes } from "../shift-notes/useShiftNotes";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import ShiftNoteForm from "../shift-notes/ShiftNoteForm";
import Tag from "../../ui/Tag";

const NotePreview = styled.div`
  background: linear-gradient(135deg, var(--color-brand-50) 0%, var(--color-brand-100) 100%);
  padding: 2rem;
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-brand-600);
  margin-bottom: 2rem;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const NoteTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 700;
  /* Force dark text because the background is always light brand color */
  color: #1f2937; 
  margin: 0;
`;

const NoteText = styled.p`
  font-size: 1.4rem;
  /* Force dark text because the background is always light brand color */
  color: #374151;
  line-height: 1.8;
  margin: 0 0 1rem 0;
`;

const NoteMeta = styled.div`
  font-size: 1.2rem;
  color: #4b5563;
  font-style: italic;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-grey-400);
  font-size: 1.6rem;
`;

function ShiftNotesPreview() {
  const { notes, isLoading } = useShiftNotes();

  if (isLoading) return <div>Loading...</div>;

  // Get the latest posted note
  const latestNote = notes?.find(n => n.status === 'posted') || notes?.[0];

  return (
    <>
      {latestNote ? (
        <NotePreview>
          <NoteHeader>
            <NoteTitle>🔄 {latestNote.shift} Shift Handover</NoteTitle>
            <Tag type={latestNote.status === 'posted' ? 'blue' : 'green'}>
              {latestNote.status.toUpperCase()}
            </Tag>
          </NoteHeader>
          <NoteText>{latestNote.note}</NoteText>
          <NoteMeta>
            by {latestNote.profiles?.full_name || 'Staff'} • {new Date(latestNote.created_at).toLocaleString()}
          </NoteMeta>
        </NotePreview>
      ) : (
        <EmptyState>
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📝</div>
          <div>No shift notes available</div>
        </EmptyState>
      )}

      <Modal>
        <Modal.Open opens="create-shift-note">
          <Button variation="primary" size="large" style={{width: '100%'}}>
            + Create Handover Note
          </Button>
        </Modal.Open>
        <Modal.Window name="create-shift-note">
          <ShiftNoteForm />
        </Modal.Window>
      </Modal>
    </>
  );
}

export default ShiftNotesPreview;
