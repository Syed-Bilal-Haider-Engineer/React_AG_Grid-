import { Commet } from 'react-loading-indicators';
const LoadingOverlay = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Commet color="#32cd32" size="medium" text="" textColor="" />
    </div>
  );

  export default LoadingOverlay