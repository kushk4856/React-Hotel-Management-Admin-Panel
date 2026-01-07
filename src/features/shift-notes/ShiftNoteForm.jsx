/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Textarea from "../../ui/Textarea";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useCreateShiftNote } from "./useShiftNotes";
import { useUser } from "../authentication/useUser";

const SectionHeader = styled.h4`
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    color: var(--color-brand-600);
`;

const Select = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

function ShiftNoteForm({ onCloseModal }) {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const { createNote, isCreating } = useCreateShiftNote();
  const { user } = useUser();

  function onSubmit(data) {
      const sections = {
          pending_rooms: data.pending_rooms,
          maintenance: data.maintenance,
          low_stock: data.low_stock
      };

      createNote({
          shift: data.shift,
          note: data.note, // General Summary
          sections: sections,
          created_by: user.id,
          status: 'posted'
      }, {
          onSuccess: () => {
              reset();
              onCloseModal?.();
          }
      });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? "modal" : "regular"}>
      <FormRow label="Current Shift">
         <Select id="shift" {...register("shift")}>
             <option value="Morning">Morning</option>
             <option value="Evening">Evening</option>
             <option value="Night">Night</option>
         </Select>
      </FormRow>

      <FormRow label="General Summary" error={errors?.note?.message}>
         <Input disabled={isCreating} id="note" {...register("note", {required: "Summary is required"})} />
      </FormRow>
    
      <hr style={{margin: '1rem 0', border: 'none', borderTop: '1px solid var(--color-grey-100)'}} />
      
      <div>
        <SectionHeader>Pending Rooms / Re-checks</SectionHeader>
        <Textarea 
             disabled={isCreating} 
             placeholder="List rooms that need attention next shift..." 
             id="pending_rooms" 
             {...register("pending_rooms")} 
        />
      </div>

      <div style={{marginTop: '1.2rem'}}>
        <SectionHeader>Maintenance Issues</SectionHeader>
        <Textarea 
             disabled={isCreating} 
             placeholder="Any critical issues reported?" 
             id="maintenance" 
             {...register("maintenance")} 
        />
      </div>

      <div style={{marginTop: '1.2rem'}}>
        <SectionHeader>Low Stock Alerts</SectionHeader>
        <Textarea 
             disabled={isCreating} 
             placeholder="What needs restocking?" 
             id="low_stock" 
             {...register("low_stock")} 
        />
      </div>

      <FormRow>
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Post Handover Draft</Button>
      </FormRow>
    </Form>
  );
}

export default ShiftNoteForm;
