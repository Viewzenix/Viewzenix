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
      <Tabs isFitted index={tabIndex} onChange={setTabIndex}>
        <TabList mb={4}>
          <Tab fontWeight="medium">Sign In</Tab>
          <Tab fontWeight="medium">Create Account</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0} pt={4}>
            <LoginForm onSuccess={handleAuthSuccess} />
          </TabPanel>
          
          <TabPanel p={0} pt={4}>
            <SignupForm onSuccess={handleAuthSuccess} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}