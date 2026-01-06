import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSingUp } from "./useSignUp";
import { useRoles } from "./useRoles";
import Spinner from "../../ui/Spinner";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { singUp, isLoading } = useSingUp();
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const { errors } = formState;

  function onSubmit({ fullName, email, password, role }) {
    singUp({ fullName, email, password, roleId: role }, { onSettled: () => reset() });
  }

  if (isLoadingRoles) return <Spinner />;
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading}
          {...register("fullName", { required: "This field is  required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "This field is  required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="Role" error={errors?.role?.message}>
        <select
          id="role"
          disabled={isLoading}
          style={{ padding: "0.8rem 1.2rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-grey-300)", backgroundColor: "var(--color-grey-0)" }}
          {...register("role", { required: "This field is required" })}
        >
          <option value="">Select a role...</option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow
        label="New Password (min 8 char)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading}
          {...register("password", {
            required: "This field is  required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register("passwordConfirm", {
            required: "This field is  required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isLoading}>
          Cancel
        </Button>
        <Button disabled={isLoading}>Create user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
