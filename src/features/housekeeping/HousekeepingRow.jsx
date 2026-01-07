/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import { useUpdateTask } from "./useUpdateTask";
import { HiChevronDown, HiLockClosed, HiArrowPath } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useStaff } from "./useStaff";
import { useAssignTask } from "./useAssignTask";
import { useUser } from "../authentication/useUser";

const Task = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const StatusButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
`;

const DropdownList = styled.ul`
  position: fixed; 
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 0.4rem 0;
  min-width: 14rem;
  border: 1px solid var(--color-grey-100);
  z-index: 1000; 
`;

const DropdownItem = styled.li`
  padding: 0.8rem 1.6rem;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const SmallButton = styled.button`
    background: none;
    border: 1px solid var(--color-brand-600);
    color: var(--color-brand-600);
    border-radius: var(--border-radius-sm);
    padding: 0.4rem 0.8rem;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    &:hover {
        background-color: var(--color-brand-50);
    }
`;

// Helper for status colors
const statusToTagName = {
    todo: "silver",
    in_progress: "blue",
    done: "brand",
    verified: "green",
};

function StatusSelector({ currentStatus, onSelect, disabled, allowedOptions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({});
  const buttonRef = useRef(null);
  
  const statusLabel = currentStatus.replace("_", " ").toUpperCase();
  const type = statusToTagName[currentStatus] || "grey";

  function toggleOpen(e) {
    if (disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      left: rect.left,
      top: rect.bottom + 8,
    });
    setIsOpen((open) => !open);
    e.stopPropagation();
  }

  function handleSelect(newStatus) {
    onSelect(newStatus);
    setIsOpen(false);
  }

  // Filter options based on RBAC rules passed in
  const options = ["todo", "in_progress", "done", "verified"].filter(s => 
      allowedOptions ? allowedOptions.includes(s) : true
  );

  return (
    <StatusWrapper>
      <StatusButton ref={buttonRef} onClick={toggleOpen} disabled={disabled || options.length === 0}>
        <Tag type={type}>
          {statusLabel}
          {!disabled && options.length > 0 && <HiChevronDown style={{ width: "1.2rem", height: "1.2rem", marginLeft: "0.2rem" }} />}
        </Tag>
      </StatusButton>

      {isOpen && !disabled && createPortal(
        <>
            <div 
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }} 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
            />
            <DropdownList style={{ top: coords.top, left: coords.left }}>
            {options.map((status) => (
                <DropdownItem key={status} onClick={() => handleSelect(status)}>
                <div
                    style={{
                    width: "0.8rem",
                    height: "0.8rem",
                    borderRadius: "50%",
                    backgroundColor: `var(--color-${statusToTagName[status]}-700)`,
                    }}
                />
                {status.replace("_", " ").toUpperCase()}
                </DropdownItem>
            ))}
            </DropdownList>
        </>,
        document.body
      )}
    </StatusWrapper>
  );
}


function HousekeepingRow({ task }) {
  const { id, status, created_at, cabins, notes, assigned_to, cabin_id } = task;
  const { updateTask, isUpdating } = useUpdateTask();
  const { assignTask, isAssigning } = useAssignTask();
  const { staff, isLoading: isLoadingStaff } = useStaff();
  const { user } = useUser();

  const isManager = user?.role === "manager" || user?.role === "admin";

  // RBAC RULES
  let allowedOptions = [];
  let isReadOnly = false;
  let showReopen = false;

  if (isManager) {
      if (status === 'verified') {
          allowedOptions = ["verified", "done", "todo"]; 
      } else {
          allowedOptions = ["todo", "in_progress", "done", "verified"];
      }
  } else {
      // Staff Rules
      if (status === 'todo') allowedOptions = ["todo", "in_progress"];
      if (status === 'in_progress') allowedOptions = ["todo", "in_progress", "done"];
      if (status === 'done') {
          allowedOptions = ["in_progress", "done"]; 
      }
      if (status === 'verified') {
          isReadOnly = true;
          allowedOptions = []; 
          showReopen = true; 
      }
  }

  function handleStatusChange(newStatus) {
    updateTask({ id, status: newStatus, cabinId: cabin_id });
  }

  function handleReopen() {
      if (window.confirm("Are you sure you want to reopen this room? It will be marked Dirty.")) {
          updateTask({ id, status: 'todo', cabinId: cabin_id });
      }
  }

  function handleAssign(e) {
    assignTask({ id, userId: e.target.value || null });
  }

  return (
    <Table.Row>
      <Task>
        <Link to={`/housekeeping/room/${id}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
             {cabins?.name || "Unknown Cabin"}
        </Link>
      </Task>

      <div>
        {isLoadingStaff ? (
             <span>Loading...</span> 
        ) : isManager ? (
            <select 
                value={assigned_to || ""} 
                onChange={handleAssign} 
                disabled={isAssigning}
                style={{ 
                    padding: '0.6rem', 
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--color-grey-300)',
                    backgroundColor: 'var(--color-grey-0)',
                    width: '100%'
                }}
            >
                <option value="">Unassigned</option>
                {staff?.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.full_name || user.email}
                    </option>
                ))}
            </select>
        ) : (
            <span>
                {staff?.find(s => s.id === assigned_to)?.full_name || "Unassigned"}
            </span>
        )}
      </div>

      <Stacked>
        <span>{new Date(created_at).toLocaleDateString()}</span>
      </Stacked>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <StatusSelector 
            currentStatus={status} 
            onSelect={handleStatusChange} 
            disabled={isUpdating || isReadOnly} 
            allowedOptions={allowedOptions}
        />
        {isReadOnly && <HiLockClosed title="Verified by Manager" style={{ color: 'var(--color-green-600)' }} />}
        {showReopen && (
            <SmallButton onClick={handleReopen} disabled={isUpdating}>
                <HiArrowPath /> Reopen
            </SmallButton>
        )}
      </div>

      <div>{notes || "-"}</div>
    </Table.Row>
  );
}

export default HousekeepingRow;
