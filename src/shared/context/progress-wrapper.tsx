'use client';
 
import { ProgressProvider } from '@bprogress/next/app';
 
const ProgressWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider 
      height="4px"
      color="#00cc44"
      options={{ showSpinner: false, }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
 
export default ProgressWrapper;