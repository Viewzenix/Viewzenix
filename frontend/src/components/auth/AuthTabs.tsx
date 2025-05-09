import { useState } from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthTabsProps {
  onAuthSuccess?: () => void;
  defaultTab?: number;
}

export function AuthTabs({ onAuthSuccess, defaultTab = 0 }: AuthTabsProps) {
  const [tabIndex, setTabIndex] = useState(defaultTab);
  
  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };
  
  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      p={6}
      width="100%"
      maxW="500px"
    >
      <Tabs.Root fitted index={tabIndex} onChange={setTabIndex}>
        <Tabs.List mb={4}>
          <Tabs.Trigger value="signin" fontWeight="medium">Sign In</Tabs.Trigger>
          <Tabs.Trigger value="signup" fontWeight="medium">Create Account</Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="signin" p={0} pt={4}>
          <LoginForm onSuccess={handleAuthSuccess} />
        </Tabs.Content>
        
        <Tabs.Content value="signup" p={0} pt={4}>
          <SignupForm onSuccess={handleAuthSuccess} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}