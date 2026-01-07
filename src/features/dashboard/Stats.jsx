/* eslint-disable react/prop-types */
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";
const Stats = ({ bookings = [], confirmedStays = [], numDays, cabinCount }) => {
  //1.
  const numBookings = bookings?.length || 0;

  //2.
  const sales = bookings?.reduce((acc, cur) => acc + cur.totalPrice, 0) || 0;

  //3.
  const checkins = confirmedStays?.filter(
    (booking) => booking.status === "checked-in"
  )?.length || 0;

  //4.
  const occupation =
    (confirmedStays?.reduce((acc, cur) => acc + cur.numNights, 0) || 0) /
    (numDays * cabinCount);

  return (
    <>
      <Stat
        title="bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + "%"}
      />
    </>
  );
};

export default Stats;
