import Heading from "../ui/Heading";
import Row from "../ui/Row";
import HousekeepingTable from "../features/housekeeping/HousekeepingTable";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import CreateTaskForm from "../features/housekeeping/CreateTaskForm";
import { HiPlus } from "react-icons/hi2";

function Housekeeping() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Housekeeping Tasks</Heading>
        <Modal>
            <Modal.Open opens="create-task">
                <Button size="medium" variation="primary">
                    <HiPlus /> Add Task
                </Button>
            </Modal.Open>
            <Modal.Window name="create-task">
                <CreateTaskForm />
            </Modal.Window>
        </Modal>
      </Row>

      <Row>
        <HousekeepingTable />
      </Row>
    </>
  );
}

export default Housekeeping;
