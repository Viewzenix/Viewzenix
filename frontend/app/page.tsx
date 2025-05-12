'use client';

import { Box, Heading, Text, Container, VStack } from '@chakra-ui/react';

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6} align="start">
        <Heading as="h1" size="2xl">Viewzenix</Heading>
        <Text fontSize="xl">
          Trading webhook platform that connects TradingView alerts to broker APIs
        </Text>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="md" mb={4}>Project Structure Setup Complete</Heading>
          <Text>
            The frontend project with Next.js, TypeScript (strict mode), and Chakra UI
            has been successfully configured.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}