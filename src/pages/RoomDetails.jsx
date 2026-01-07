import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Button from "../ui/Button";
import { useHousekeepingTasks } from "../features/housekeeping/useHousekeepingTasks"; 
import { useUpdateTask } from "../features/housekeeping/useUpdateTask";
import Spinner from "../ui/Spinner";
import Tag from "../ui/Tag";
import Modal from "../ui/Modal";
import CreateTicketForm from "../features/maintenance/CreateTicketForm";

const Card = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  margin-bottom: 2rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:last-child {
    border-bottom: none;
  }
`;

const Checklist = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.6rem;
  cursor: pointer;
`;

function RoomDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, isLoading } = useHousekeepingTasks();
  const { updateTask, isUpdating } = useUpdateTask();
  
  const task = tasks?.find(t => t.id === Number(taskId));
  
  // Local state for checklist
  const [checklistItems, setChecklistItems] = useState([]);

  useEffect(() => {
     // Mock checklist logic until backend supports it
     setChecklistItems([
         { label: "Change Bed Sheets", checked: false },
         { label: "Clean Bathroom", checked: false },
         { label: "Restock Minibar", checked: false },
         { label: "Vacuum Floor", checked: false },
         { label: "Empty Trash", checked: false },
     ]);
  }, [task]);

  function toggleItem(index) {
     const newItems = [...checklistItems];
     newItems[index].checked = !newItems[index].checked;
     setChecklistItems(newItems);
  }

  function handleSave() {
     const allChecked = checklistItems.every(i => i.checked);
     // Auto-advance status if all checked (simple logic)
     const nextStatus = allChecked ? 'done' : 'in_progress';
     
     updateTask({ 
        id: task.id, 
        status: nextStatus,
        cabinId: task.cabin_id // Sync cabin status
     });
     navigate(-1);
  }

  function handleReopen() {
      if (window.confirm("Are you sure you want to reopen this room? It will be marked Dirty.")) {
          updateTask({ id: task.id, status: 'todo', cabinId: task.cabin_id });
          navigate(-1);
      }
  }

  if (isLoading) return <Spinner />;
  if (!task) return <div>Task not found</div>;

  const statusTags = {
      todo: 'silver',
      in_progress: 'blue',
      done: 'brand',
      verified: 'green'
  };

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Room {task.cabins?.name}</Heading>
        <Tag type={statusTags[task.status] || 'grey'}>{task.status.replace('_', ' ').toUpperCase()}</Tag>
      </Row>

      <Card>
        <Heading as="h3">Task Details</Heading>
        <DetailRow><span>Task ID:</span><span>#{task.id}</span></DetailRow>
        <DetailRow><span>Priority:</span><span>{task.priority || 'Normal'}</span></DetailRow>
        <DetailRow><span>Date:</span><span>{new Date(task.created_at).toLocaleDateString()}</span></DetailRow>
        <DetailRow><span>Notes:</span><span>{task.notes || "None"}</span></DetailRow>
      </Card>

      <Card>
         <Heading as="h3">Cleaning Checklist</Heading>
         <Checklist>
            {checklistItems.map((item, index) => (
                <CheckboxLabel key={index}>
                    <input 
                        type="checkbox" 
                        checked={item.checked} 
                        onChange={() => toggleItem(index)}
                        disabled={isUpdating || task.status === 'verified'}
                    /> 
                    {item.label}
                </CheckboxLabel>
            ))}
         </Checklist>
      </Card>

      <Row type="horizontal">
        <Button variation="secondary" onClick={() => navigate(-1)}>Back</Button>
        
        {task.status === 'verified' ? (
            <Button variation="secondary" onClick={handleReopen} disabled={isUpdating}>
               Reopen Task
            </Button>
        ) : (
            <Button variation="primary" onClick={handleSave} disabled={isUpdating}>
               {isUpdating ? "Saving..." : "Save & Complete"}
            </Button>
        )} 

        <Modal>
            <Modal.Open opens="report-issue">
                <Button variation="danger">Report Maintenance</Button>
            </Modal.Open>
            <Modal.Window name="report-issue">
                <CreateTicketForm prefillCabinId={task.cabin_id} />
                {/* Ensure CreateTicketForm accepts prefillCabinId or user selects it */}
            </Modal.Window>
        </Modal>
      </Row>
    </>
  );
}

export default RoomDetails;
