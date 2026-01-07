import styled from "styled-components";
import { useCabins } from "../cabins/useCabins";
import Spinner from "../../ui/Spinner";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-around;
  padding: 1.6rem;
  background-color: var(--color-grey-100);
  border-radius: var(--border-radius-md);
`;

const StatItem = styled.div`
  text-align: center;
  
  .count {
    font-size: 3.2rem;
    font-weight: 800;
    margin-bottom: 0.4rem;
    color: var(--color-grey-800);
  }
  
  .label {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-grey-500);
    text-transform: uppercase;
  }
`;

const RoomGridContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.8rem;
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-brand-500);
    border-radius: 10px;
    
    &:hover {
      background: var(--color-brand-600);
    }
  }
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 1.2rem;
  min-width: fit-content;
`;

const RoomCard = styled.div`
  min-width: 110px;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  border: 2px solid transparent; 
  background-color: var(--color-grey-100);
  
  ${props => {
    switch(props.status) {
      case 'dirty':
        return `
          background-color: var(--color-red-100); 
          border-color: var(--color-red-700);
          color: var(--color-red-800);
          
          &:hover {
             filter: brightness(0.95);
             transform: scale(1.05);
          }
        `;
      case 'cleaning':
        return `
          background-color: var(--color-yellow-100);
          border-color: var(--color-yellow-700);
          color: var(--color-yellow-700);
          
          &:hover {
            filter: brightness(0.95);
            transform: scale(1.05);
          }
        `;
      case 'clean':
        return `
          background-color: var(--color-blue-100);
          border-color: var(--color-blue-700);
          color: var(--color-blue-700);
          
          &:hover {
            filter: brightness(0.95);
            transform: scale(1.05);
          }
        `;
      case 'ready':
        return `
          background-color: var(--color-green-100);
          border-color: var(--color-green-700);
          color: var(--color-green-700);
          
          &:hover {
            filter: brightness(0.95);
            transform: scale(1.05);
          }
        `;
      default:
        return `
          background-color: var(--color-grey-100);
          border-color: var(--color-grey-300);
          color: var(--color-grey-500);
        `;
    }
  }}
`;

const RoomNumber = styled.div`
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
`;

const RoomStatus = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  ${props => {
    switch(props.status) {
      case 'dirty': return 'background-color: var(--color-red-700);';
      case 'cleaning': return 'background-color: var(--color-yellow-700);';
      case 'clean': return 'background-color: var(--color-blue-700);';
      case 'ready': return 'background-color: var(--color-green-700);';
      default: return 'background-color: var(--color-grey-400);';
    }
  }}
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.4rem;
  padding-top: 1.6rem;
  margin-top: 1.6rem;
  border-top: 1px solid var(--color-grey-200);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const LegendDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  ${props => `
    background-color: ${props.color};
    border: 2px solid ${props.borderColor};
  `}
`;

function RoomStatusBoard() {
  const { cabins, isLoading } = useCabins();

  if (isLoading) return <Spinner />;

  // Calculate stats
  const stats = {
    dirty: cabins?.filter(c => c.clean_status === 'dirty').length || 0,
    cleaning: cabins?.filter(c => c.clean_status === 'cleaning').length || 0,
    clean: cabins?.filter(c => c.clean_status === 'clean').length || 0,
    ready: cabins?.filter(c => c.clean_status === 'ready').length || 0,
  };

  return (
    <Container>
      <StatsRow>
        <StatItem>
          <div className="count">{stats.dirty}</div>
          <div className="label">Dirty</div>
        </StatItem>
        <StatItem>
          <div className="count">{stats.cleaning}</div>
          <div className="label">Cleaning</div>
        </StatItem>
        <StatItem>
          <div className="count">{stats.clean}</div>
          <div className="label">Clean</div>
        </StatItem>
        <StatItem>
          <div className="count">{stats.ready}</div>
          <div className="label">Ready</div>
        </StatItem>
      </StatsRow>

      <RoomGridContainer>
        <RoomGrid>
          {cabins?.map(cabin => (
            <RoomCard key={cabin.id} status={cabin.clean_status}>
              <StatusIndicator status={cabin.clean_status} />
              <RoomNumber>{cabin.name}</RoomNumber>
              <RoomStatus>{cabin.clean_status}</RoomStatus>
            </RoomCard>
          ))}
        </RoomGrid>
      </RoomGridContainer>
      
      <Legend>
        <LegendItem>
          <LegendDot color="var(--color-red-100)" borderColor="var(--color-red-700)" />
          <span>Dirty</span>
        </LegendItem>
        <LegendItem>
          <LegendDot color="var(--color-yellow-100)" borderColor="var(--color-yellow-700)" />
          <span>Cleaning</span>
        </LegendItem>
        <LegendItem>
          <LegendDot color="var(--color-blue-100)" borderColor="var(--color-blue-700)" />
          <span>Clean</span>
        </LegendItem>
        <LegendItem>
          <LegendDot color="var(--color-green-100)" borderColor="var(--color-green-700)" />
          <span>Ready</span>
        </LegendItem>
      </Legend>
    </Container>
  );
}

export default RoomStatusBoard;
