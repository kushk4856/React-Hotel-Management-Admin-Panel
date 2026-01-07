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
  
  // Local state for checklist to allow instant UI feedback
  const [checklistItems, setChecklistItems] = useState([]);

  useEffect(() => {
    if (task?.checklist && Array.isArray(task.checklist)) {
       setChecklistItems(task.checklist);
    } else {
       // Default Checklist if empty
       setChecklistItems([
         { label: "Change Bed Sheets", checked: false },
         { label: "Clean Bathroom", checked: false },
         { label: "Restock Minibar", checked: false },
         { label: "Vacuum Floor", checked: false }
       ]);
    }
  }, [task]);

  function toggleItem(index) {
     const newItems = [...checklistItems];
     newItems[index].checked = !newItems[index].checked;
     setChecklistItems(newItems);
  }

  function handleSave() {
     updateTask({ 
        id: task.id, 
        checklist: checklistItems,
        status: checklistItems.every(i => i.checked) ? 'completed' : 'cleaning'
     });
     navigate(-1);
  }

  if (isLoading) return <Spinner />;
  if (!task) return <div>Task not found</div>;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Room {task.cabins?.name}</Heading>
        <Tag type={task.status === 'completed' ? 'green' : 'blue'}>{task.status}</Tag>
      </Row>

      <Card>
        <DetailRow><span>Assigned To:</span><span>{task.assigned_to ? 'Me' : 'Unassigned'}</span></DetailRow>
        <DetailRow><span>Date:</span><span>{new Date(task.task_date).toLocaleDateString()}</span></DetailRow>
        <DetailRow><span>Notes:</span><span>{task.notes || "None"}</span></DetailRow>
      </Card>

      <Card>
         <Heading as="h2">Cleaning Checklist</Heading>
         <Checklist>
            {checklistItems.map((item, index) => (
                <CheckboxLabel key={index}>
                    <input 
                        type="checkbox" 
                        checked={item.checked} 
                        onChange={() => toggleItem(index)}
                        disabled={isUpdating}
                    /> 
                    {item.label}
                </CheckboxLabel>
            ))}
         </Checklist>
      </Card>

      <Row type="horizontal">
        <Button variation="secondary" onClick={() => navigate(-1)}>Back</Button>
        <Button variation="primary" onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Progress"}
        </Button> 
        <Button variation="danger">Report Maintenance</Button>
      </Row>
    </>
  );
}

export default RoomDetails;
