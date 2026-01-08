
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Table from "../ui/Table";
import Tag from "../ui/Tag";
import Spinner from "../ui/Spinner";
import Pagination from "../ui/Pagination";
import { format } from "date-fns";
import { useAuditLogs } from "../features/admin/useAuditLogs";
import styled from "styled-components";

const TableContainer = styled.div`
    background: var(--color-grey-0);
    padding: 0;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-grey-100);
    overflow: hidden;
`;

const ActorName = styled.div`
    font-weight: 500;
`;

const Details = styled.div`
    color: var(--color-grey-500);
`;

function AuditLogs() {
    const { logs, isLoading, count } = useAuditLogs();

    if (isLoading) return <Spinner />;

    // Helper for color
    const getActionColor = (action) => {
        if (!action) return "grey";
        const act = action.toUpperCase();
        if (act.includes("DELETE") || act.includes("FAIL")) return "red";
        if (act.includes("UPDATE") || act.includes("CHANGE")) return "yellow";
        if (act.includes("LOGIN") || act.includes("CREATE") || act.includes("INIT")) return "green";
        return "grey";
    };

    if (!logs?.length) return (
         <>
            <Heading as="h1">System Audit Logs</Heading>
            <div style={{marginTop: '2rem'}}>No logs found.</div>
         </>
    );

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">System Audit Logs</Heading>
            </Row>
            
            <Row>
                <TableContainer>
                    <Table columns="1.2fr 1.2fr 2fr 1.2fr">
                        <Table.Header>
                            <div>Time</div>
                            <div>Actor</div>
                            <div>Action Details</div>
                            <div>Type</div>
                        </Table.Header>
                        <Table.Body data={logs} render={log => (
                            <Table.Row key={log.id}>
                                <div>{format(new Date(log.created_at), "MMM dd, HH:mm")}</div>
                                <ActorName>{log.actor_name || 'System'}</ActorName>
                                <Details>{log.details || log.action}</Details>
                                <div><Tag type={getActionColor(log.action)}>{log.action}</Tag></div>
                            </Table.Row>
                        )}/>
                        
                        <Table.Footer>
                            <Pagination count={count} />
                        </Table.Footer>
                    </Table>
                </TableContainer>
            </Row>
        </>
    )
}
export default AuditLogs;
