## VZX-BE-1-2-3: Implement Broker Integration Layer

**Priority:** High
**Type:** Feature
**Assignee:** Backend Developer
**Status:** Todo

### Description
Implement a comprehensive broker integration layer that provides a unified interface for interacting with different trading brokers. This layer will handle broker-specific API interactions, connection management, and credential storage.

### Technical Requirements

1. Core Integration Layer:

```python
from typing import Dict, List, Optional
from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum

class BrokerType(Enum):
    ALPACA = "ALPACA"
    INTERACTIVE_BROKERS = "INTERACTIVE_BROKERS"
    TRADIER = "TRADIER"

class BrokerAdapter(ABC):
    @abstractmethod
    async def connect(self) -> bool:
        """Establish connection with broker"""
        pass

    @abstractmethod
    async def verify_credentials(self) -> bool:
        """Verify API credentials"""
        pass

    @abstractmethod
    async def get_account_info(self) -> Dict[str, any]:
        """Get account information"""
        pass

    @abstractmethod
    async def submit_order(self, order: Dict[str, any]) -> Dict[str, any]:
        """Submit order to broker"""
        pass

    @abstractmethod
    async def cancel_order(self, order_id: str) -> bool:
        """Cancel order"""
        pass

    @abstractmethod
    async def get_positions(self) -> List[Dict[str, any]]:
        """Get current positions"""
        pass

class AlpacaAdapter(BrokerAdapter):
    def __init__(self, api_key: str, api_secret: str, paper_trading: bool = False):
        self.api_key = api_key
        self.api_secret = api_secret
        self.paper_trading = paper_trading
        self.client = None
        self.logger = logging.getLogger("viewzenix.broker.alpaca")

    async def connect(self) -> bool:
        try:
            self.client = AlpacaClient(
                api_key=self.api_key,
                api_secret=self.api_secret,
                paper=self.paper_trading
            )
            await self.client.connect()
            return True
        except Exception as e:
            self.logger.error(f"Alpaca connection failed: {e}")
            return False

    # ... other method implementations
```

2. Broker Connection Management:

```python
class BrokerConnectionService:
    def __init__(self, db: Database):
        self.db = db
        self.logger = logging.getLogger("viewzenix.broker_connection")
        self._adapters: Dict[str, BrokerAdapter] = {}

    async def add_connection(
        self,
        user_id: str,
        broker_data: Dict[str, any]
    ) -> Dict[str, any]:
        """Add new broker connection"""
        try:
            # Validate broker data
            self._validate_broker_data(broker_data)

            # Create adapter instance
            adapter = self._create_adapter(broker_data)

            # Verify credentials
            if not await adapter.verify_credentials():
                raise ValidationError("Invalid broker credentials")

            # Encrypt sensitive data
            encrypted_data = self._encrypt_credentials(broker_data)

            # Store in database
            connection = await self.db.broker_connections.create({
                "user_id": user_id,
                "broker_type": broker_data["broker"],
                "name": broker_data.get("name"),
                "credentials": encrypted_data,
                "paper_trading": broker_data.get("paper_trading", False),
                "status": "ACTIVE"
            })

            # Cache adapter
            self._adapters[connection.id] = adapter

            return connection

        except Exception as e:
            self.logger.error(f"Failed to add broker connection: {e}")
            raise

    async def get_adapter(self, connection_id: str) -> BrokerAdapter:
        """Get or create broker adapter for connection"""
        pass

    async def test_connection(self, connection_id: str) -> bool:
        """Test broker connection"""
        pass

    def _encrypt_credentials(self, data: Dict[str, any]) -> Dict[str, any]:
        """Encrypt sensitive broker credentials"""
        pass
```

3. Database Schema:

```sql
CREATE TABLE broker_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    broker_type VARCHAR(50) NOT NULL,
    name VARCHAR(100),
    credentials JSONB NOT NULL,
    paper_trading BOOLEAN DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    last_connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_broker_connections_user_id ON broker_connections(user_id);
CREATE INDEX idx_broker_connections_status ON broker_connections(status);
```

4. API Endpoints:

```python
@broker_router.post("/connections")
async def create_connection(
    connection_data: BrokerConnectionCreate,
    current_user: User = Depends(get_current_user)
):
    """Create new broker connection"""
    pass

@broker_router.get("/connections")
async def list_connections(
    current_user: User = Depends(get_current_user)
):
    """List user's broker connections"""
    pass

@broker_router.delete("/connections/{connection_id}")
async def delete_connection(
    connection_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete broker connection"""
    pass

@broker_router.post("/connections/{connection_id}/test")
async def test_connection(
    connection_id: str,
    current_user: User = Depends(get_current_user)
):
    """Test broker connection"""
    pass
```

### Acceptance Criteria
- [ ] Broker adapter interface implemented
- [ ] Alpaca broker adapter implemented
- [ ] Connection management service implemented
- [ ] Secure credential storage implemented
- [ ] Connection testing functionality working
- [ ] API endpoints implemented and tested
- [ ] Error handling and logging implemented
- [ ] Database schema created with proper indexes
- [ ] Unit tests written for all components
- [ ] Integration tests with actual broker APIs
- [ ] Documentation updated with integration guide

### Dependencies
- VZX-BE-1-2-1: Trading Service Implementation
- VZX-BE-1-2-2: Order Management Service

### Testing Requirements
1. Unit Tests:
   - Adapter implementations
   - Connection management
   - Credential encryption
   - Error handling

2. Integration Tests:
   - Broker API connectivity
   - Order submission
   - Position retrieval
   - Error scenarios

3. Security Tests:
   - Credential encryption
   - API key storage
   - Connection security
   - Error handling security

### Security Considerations
- Secure storage of API credentials
- Encryption of sensitive data
- Secure broker communication
- Connection pooling and timeouts
- Rate limiting implementation
- Audit logging for all operations
- Error handling security
- Regular security scanning

### Related Resources
- [Alpaca API Documentation](https://alpaca.markets/docs/api-documentation/)
- [Interactive Brokers API](https://www.interactivebrokers.com/en/index.php?f=5041)
- [Encryption Best Practices](https://docs.python.org/3/library/crypto.html)
- [Project API Documentation](mdc:.project/docs/api/broker-integration.md) 