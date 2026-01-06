import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";

const FullPage = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Dark Gradient Background for contrast */
  background: linear-gradient(135deg, var(--color-brand-900) 0%, var(--color-brand-600) 100%);
  position: relative;
  overflow: hidden;
`;

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  z-index: 0;
`;

const Blob1 = styled(Blob)`
  top: 10%;
  left: 20%;
  width: 30rem;
  height: 30rem;
  background: var(--color-brand-200);
`;

const Blob2 = styled(Blob)`
  bottom: 20%;
  right: 20%;
  width: 35rem;
  height: 35rem;
  background: var(--color-red-500);
`;

const GlassCard = styled.div`
  /* Glassmorphism Core */
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 2rem;
  
  padding: 4.8rem 6.4rem;
  text-align: center;
  z-index: 10;
  color: white;
  max-width: 60rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
`;

const StyledButton = styled.button`
  background: white;
  color: var(--color-brand-700);
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.6rem;
  font-weight: 600;
  border-radius: 5rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1.2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
`;

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <FullPage>
      <Blob1 />
      <Blob2 />
      <GlassCard>
        <Heading as="h1" style={{ color: "white", fontSize: "3rem" }}>
          🚫 Access Denied
        </Heading>
        <p style={{ fontSize: "1.8rem", color: "#f3f4f6" }}>
          You do not have permission to view this page. <br />
          Contact your administrator to request access.
        </p>
        <StyledButton onClick={() => navigate("/dashboard", { replace: true })}>
          &larr; Return to Dashboard
        </StyledButton>
      </GlassCard>
    </FullPage>
  );
}

export default AccessDenied;
