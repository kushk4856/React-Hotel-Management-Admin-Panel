import { useRecentBookings } from "../dashboard/useRecentBookings";
import { useRecentStays } from "../dashboard/useRecentStays";
import { useCabins } from "../cabins/useCabins";
import Stats from "../dashboard/Stats";
import SalesChart from "../dashboard/SalesChart";
import Spinner from "../../ui/Spinner";
import styled from "styled-components";
import Button from "../../ui/Button";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { exportToCSV } from "../../utils/helpers";

const StyledReport = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.4rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default function BusinessReport() {
  const { bookings, isLoading: isLoading1 } = useRecentBookings();
  const { confirmedStays, isLoading: isLoading2, numDays } = useRecentStays();
  const { cabins, isLoading: isLoading3 } = useCabins();

  if (isLoading1 || isLoading2 || isLoading3) return <Spinner />;

  const handleExport = () => {
       const exportData = bookings?.map(b => ({
           ID: b.id,
           Guest: b.guests?.fullName || 'Unknown',
           Cabin: b.cabins?.name || 'Unknown',
           Status: b.status,
           TotalPrice: b.totalPrice,
           StartDate: b.startDate,
           EndDate: b.endDate
       })) || [];
       exportToCSV(exportData, `business_report_${numDays}days`);
  };

  return (
    <StyledReport>
       <div style={{display:'flex', justifyContent:'flex-end'}}>
            <Button size="small" onClick={handleExport} variation="secondary">
                <div style={{display:'flex', alignItems:'center', gap: '0.5rem'}}>
                    <HiOutlineArrowDownTray /> <span>Export Bookings</span>
                </div>
            </Button>
       </div>
       <StatsGrid>
         <Stats bookings={bookings} confirmedStays={confirmedStays} numDays={numDays} cabinCount={cabins.length} />
       </StatsGrid>
       
       <SalesChart bookings={bookings} numDays={numDays} />
    </StyledReport>
  );
}
