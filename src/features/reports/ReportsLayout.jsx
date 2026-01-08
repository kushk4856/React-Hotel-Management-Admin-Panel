import styled from "styled-components";
import { useState } from "react";
import DashboardFilter from "../dashboard/DashboardFilter";
import ReportsNavigation from "./ReportsNavigation";
import BusinessReport from "./BusinessReport";
import OperationsReport from "./OperationsReport";

const StyledReportsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.6rem;
`;

export default function ReportsLayout() {
  const [activeTab, setActiveTab] = useState("business");

  return (
    <StyledReportsLayout>
      <ReportHeader>
         <ReportsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
         {/* Filter applies to Business Report predominantly */}
         <DashboardFilter />
      </ReportHeader>
      
      {activeTab === 'business' && <BusinessReport />}
      {activeTab === 'operations' && <OperationsReport />}
    </StyledReportsLayout>
  )
}
