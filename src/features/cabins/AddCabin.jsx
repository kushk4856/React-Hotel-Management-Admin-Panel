import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
import RestrictedTo from "../../ui/RestrictedTo";

function AddCabin() {
  return (
    <div>
      <RestrictedTo allowedRole={["admin", "manager"]}>
        <Modal>
          <Modal.Open opens="cabin-form">
            <Button>Add new cabin</Button>
          </Modal.Open>
          <Modal.Window name="cabin-form">
            <CreateCabinForm />
          </Modal.Window>
        </Modal>
      </RestrictedTo>
    </div>
  );
}

export default AddCabin;
