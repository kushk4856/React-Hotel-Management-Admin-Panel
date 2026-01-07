import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import { useShiftNotes } from "./useShiftNotes";
import ShiftNoteItem from "./ShiftNoteItem";

function ShiftNotesList() {
    const { notes, isLoading } = useShiftNotes();

    if (isLoading) return <Spinner />;
    if (!notes?.length) return <Empty resourceName="handover notes" />;

    return (
        <div>
            {notes.map(note => <ShiftNoteItem key={note.id} note={note} />)}
        </div>
    );
}

export default ShiftNotesList;
