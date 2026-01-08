/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import { useCreateTicket } from "./useCreateTicket";
import { useCabins } from "../cabins/useCabins"; 
import Spinner from "../../ui/Spinner";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

function CreateTicketForm({ onCloseModal, prefillCabinId }) {
  const { register, handleSubmit, reset, formState } = useForm({
      defaultValues: {
          cabin_id: prefillCabinId
      }
  });
  const { errors } = formState;
  const { createTicket, isCreating } = useCreateTicket();
  const { cabins, isLoading: isLoadingCabins } = useCabins();

  function onSubmit(data) {
    // Basic image upload logic would go here (storage bucket), skipping for MVP
    
    createTicket({
      description: data.description,
      cabin_id: data.cabin_id,
      priority: data.priority,
      category: data.category,

      status: 'new', // New flow default
      // photo_url: ... 
    }, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      }
    });
  }

  if (isLoadingCabins) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? "modal" : "regular"}>
      <FormRow label="Room / Cabin" error={errors?.cabin_id?.message}>
         <StyledSelect disabled={isCreating} id="cabin_id" {...register("cabin_id", { required: "This field is required" })}>
            <option value="">Select Room...</option>
            {cabins?.map(cabin => (
                <option key={cabin.id} value={cabin.id}>{cabin.name}</option>
            ))}
         </StyledSelect>
      </FormRow>

      <FormRow label="Category" error={errors?.category?.message}>
        <StyledSelect disabled={isCreating} id="category" {...register("category")}>
           <option value="general">General</option>
           <option value="electrical">Electrical</option>
           <option value="plumbing">Plumbing</option>
           <option value="hvac">AC / HVAC</option>
           <option value="furniture">Furniture</option>
        </StyledSelect>
      </FormRow>

      <FormRow label="Priority" error={errors?.priority?.message}>
        <StyledSelect disabled={isCreating} id="priority" {...register("priority")}>
           <option value="low">Low</option>
           <option value="medium">Medium</option>
           <option value="high">High</option>
           <option value="critical">Critical</option>
        </StyledSelect>
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea 
            disabled={isCreating} 
            id="description" 
            {...register("description", { required: "Description is required" })} 
        />
      </FormRow>

      <FormRow label="Photo (Optional)">
         <FileInput id="image" accept="image/*" disabled={isCreating} {...register("image")} />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Create Ticket</Button>
      </FormRow>
    </Form>
  );
}

export default CreateTicketForm;
