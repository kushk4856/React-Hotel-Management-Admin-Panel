import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import ShiftNoteForm from "../features/shift-notes/ShiftNoteForm";
import ShiftNotesList from "../features/shift-notes/ShiftNotesList";

function ShiftNotes() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Shift Handover & Notes</Heading>
        <Modal>
            <Modal.Open opens="new-note">
                <Button>+ Create Handover Note</Button>
            </Modal.Open>
            <Modal.Window name="new-note">
                <ShiftNoteForm />
            </Modal.Window>
        </Modal>
      </Row>

      <Row>
         <ShiftNotesList />
      </Row>
    </>
  );
}
export default ShiftNotes;
