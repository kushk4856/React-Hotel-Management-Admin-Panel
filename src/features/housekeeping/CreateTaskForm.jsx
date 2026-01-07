/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
// import Input from "../../ui/Input"; // Removed unused import
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useCreateTask } from "./useCreateTask";
import { useCabins } from "../cabins/useCabins";
import { useUser } from "../authentication/useUser";
import Spinner from "../../ui/Spinner";
import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

function CreateTaskForm({ onCloseModal }) {
  const { createTask, isCreating } = useCreateTask();
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const { user } = useUser();
  
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      priority: "normal",
      status: "todo",
    }
  });
  const { errors } = formState;

  if (isLoadingCabins) return <Spinner />;

  function onSubmit(data) {
    createTask(
      { 
        ...data, 
        // Assign to current user by default if not specified (or create UI for it later)
        assigned_to: user.id 
      },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? "modal" : "regular"}>
      <FormRow label="Cabin" error={errors?.cabin_id?.message}>
        <StyledSelect
          disabled={isCreating}
          id="cabin_id"
          {...register("cabin_id", { required: "This field is required" })}
        >
          <option value="">Select a cabin...</option>
          {cabins?.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </StyledSelect>
      </FormRow>

      <FormRow label="Task Type" error={errors?.task_type?.message}>
        <StyledSelect
          disabled={isCreating}
          id="task_type"
          {...register("task_type", { required: "This field is required" })}
        >
            <option value="custom">Custom / Other</option>
            <option value="checkout_clean">Checkout Clean</option>
            <option value="stayover_clean">Stayover Clean</option>
            <option value="deep_clean">Deep Clean</option>
            <option value="inspection">Inspection</option>
        </StyledSelect>
      </FormRow>

      <FormRow label="Priority" error={errors?.priority?.message}>
        <StyledSelect
            disabled={isCreating}
            id="priority"
            {...register("priority")}
        >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
        </StyledSelect>
      </FormRow>

      <FormRow label="Description / Notes" error={errors?.notes?.message}>
        <Textarea
          disabled={isCreating}
          id="notes"
          {...register("notes", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Add Task</Button>
      </FormRow>
    </Form>
  );
}

export default CreateTaskForm;
