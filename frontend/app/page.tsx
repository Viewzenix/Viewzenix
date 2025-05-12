'use client';

import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardHeader, 
  CardBody, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText,
  Icon,
  Flex,
  Button
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';

export default function Home() {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Webhooks</StatLabel>
              <StatNumber>24</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={ArrowUpIcon} color="green.500" mr={1} />
                  <Text color="green.500">12%</Text>
                  <Text ml={1}>since last month</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Bots</StatLabel>
              <StatNumber>8</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={ArrowUpIcon} color="green.500" mr={1} />
                  <Text color="green.500">25%</Text>
                  <Text ml={1}>since last month</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Orders Executed</StatLabel>
              <StatNumber>156</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={ArrowUpIcon} color="green.500" mr={1} />
                  <Text color="green.500">18%</Text>
                  <Text ml={1}>since last month</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Success Rate</StatLabel>
              <StatNumber>96.4%</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={ArrowDownIcon} color="red.500" mr={1} />
                  <Text color="red.500">2.3%</Text>
                  <Text ml={1}>since last month</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            <Text>Your recent trading activity will appear here.</Text>
            <Button mt={4} colorScheme="brand" size="sm">View All Activity</Button>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <Heading size="md">Webhook Status</Heading>
          </CardHeader>
          <CardBody>
            <Text>Your webhook endpoint status information will appear here.</Text>
            <Button mt={4} colorScheme="brand" size="sm">Configure Webhooks</Button>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}