/* eslint-disable react/prop-types */
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Table from "../ui/Table";
import Tag from "../ui/Tag";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import { useRoles } from "../features/admin/useRoles";
import { useUpdateRole } from "../features/admin/useUpdateRole";
import { HiPencil } from "react-icons/hi2";
import { useState } from "react";
import styled from "styled-components";
import { PERMISSIONS } from "../utils/constants";

const PermissionGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
    padding: 1rem 0;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.4rem;
    cursor: pointer;
`;

const TableContainer = styled.div`
    background: var(--color-grey-0);
    padding: 0;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-grey-100);
    overflow: hidden;
`;

const InfoBox = styled.div`
    margin-top: 2rem;
    padding: 2rem;
    background: var(--color-yellow-100);
    color: var(--color-yellow-700);
    border-radius: var(--border-radius-sm);
`;

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

function UpdateRoleForm({ role, onCloseModal }) {
    const { updateRole, isUpdating } = useUpdateRole();
    const [selectedPerms, setSelectedPerms] = useState(role.permissions || []);

    const togglePerm = (perm) => {
        if (selectedPerms.includes(perm)) {
            setSelectedPerms(selectedPerms.filter(p => p !== perm));
        } else {
            setSelectedPerms([...selectedPerms, perm]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateRole({ id: role.id, permissions: selectedPerms }, {
            onSuccess: onCloseModal
        });
    };

    return (
        <Form onSubmit={handleSubmit} type="modal">
            <Heading as="h2">Edit Permissions for {role.name}</Heading>
            <PermissionGrid>
                {ALL_PERMISSIONS.map(p => (
                    <CheckboxLabel key={p}>
                        <input 
                            type="checkbox" 
                            checked={selectedPerms.includes(p)} 
                            onChange={() => togglePerm(p)}
                            disabled={isUpdating}
                        />
                        {p}
                    </CheckboxLabel>
                ))}
            </PermissionGrid>
            <FormRow>
                <Button variation="secondary" type="button" onClick={onCloseModal} disabled={isUpdating}>Cancel</Button>
                <Button disabled={isUpdating}>Save Changes</Button>
            </FormRow>
        </Form>
    );
}

function RolesPermissions() {
    const { roles, isLoading } = useRoles();

    if (isLoading) return <Spinner />;

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Roles & Permissions</Heading>
            </Row>
            
            <Row>
                <TableContainer>
                    <Modal>
                    <Table columns="1.5fr 3fr 0.5fr">
                        <Table.Header>
                            <div>Role</div>
                            <div>Permissions Scope</div>
                            <div></div>
                        </Table.Header>
                        <Table.Body data={roles || []} render={row => (
                            <Table.Row key={row.id}>
                                <div style={{fontWeight: 700, textTransform: 'capitalize', color: 'var(--color-grey-600)'}}>{row.name}</div>
                                <div style={{color: 'var(--color-grey-500)', fontSize: '1.4rem'}}>
                                    {row.permissions && row.permissions.length > 0 ? row.permissions.join(", ") : <Tag type="grey">No Permissions</Tag>}
                                </div>
                                <div>
                                    <Modal.Open opens={`edit-role-${row.id}`}>
                                        <Button variation="secondary" size="small" aria-label={`Edit ${row.name} permissions`}><HiPencil /></Button>
                                    </Modal.Open>
                                    <Modal.Window name={`edit-role-${row.id}`}>
                                        <UpdateRoleForm role={row} />
                                    </Modal.Window>
                                </div>
                            </Table.Row>
                        )}/>
                    </Table>
                    </Modal>
                </TableContainer>
                 <InfoBox>
                    ℹ️ Roles are fetched from the database. Permissions can be updated via SQL or Admin API.
                </InfoBox>
            </Row>
        </>
    )
}
export default RolesPermissions;
