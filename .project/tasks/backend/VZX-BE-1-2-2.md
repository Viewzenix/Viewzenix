## VZX-BE-1-2-2: Create Order Management Service

**Priority:** High
**Type:** Feature
**Assignee:** Backend Developer
**Status:** Todo

### Description
Implement a comprehensive order management service that handles order creation, modification, cancellation, and status tracking. This service will be the central component for managing all trading orders in the system.

### Technical Requirements

1. Core Service Implementation:

```python
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum

class OrderType(Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"

class OrderSide(Enum):
    BUY = "BUY"
    SELL = "SELL"

class OrderStatus(Enum):
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"

class OrderService:
    def __init__(self, broker_adapter: BrokerAdapter, db: Database):
        self.broker_adapter = broker_adapter
        self.db = db
        self.logger = logging.getLogger("viewzenix.order_service")

    async def create_order(self, order_data: Dict[str, any]) -> Dict[str, any]:
        """
        Create a new order and submit it to the broker.
        
        Args:
            order_data: Dictionary containing order details
            
        Returns:
            Created order object with broker response
            
        Raises:
            ValidationError: If order data is invalid
            BrokerError: If broker submission fails
        """
        try:
            # Validate order data
            validated_data = self._validate_order_data(order_data)
            
            # Create order in database
            order = await self.db.orders.create(validated_data)
            
            # Submit to broker
            broker_response = await self.broker_adapter.submit_order(validated_data)
            
            # Update order with broker information
            updated_order = await self.db.orders.update(
                order.id,
                {
                    "broker_order_id": broker_response["id"],
                    "status": OrderStatus.SUBMITTED.value
                }
            )
            
            return updated_order
            
        except Exception as e:
            self.logger.error(f"Order creation failed: {e}")
            raise

    async def modify_order(
        self,
        order_id: str,
        modifications: Dict[str, any]
    ) -> Dict[str, any]:
        """Modify an existing order"""
        pass

    async def cancel_order(self, order_id: str) -> Dict[str, any]:
        """Cancel an existing order"""
        pass

    async def get_order(self, order_id: str) -> Dict[str, any]:
        """Get order details"""
        pass

    async def list_orders(
        self,
        user_id: str,
        status: Optional[List[OrderStatus]] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[Dict[str, any]]:
        """List orders with optional filtering"""
        pass

    def _validate_order_data(self, data: Dict[str, any]) -> Dict[str, any]:
        """Validate order data"""
        pass
```

2. Database Schema:

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    broker_order_id VARCHAR(255),
    symbol VARCHAR(20) NOT NULL,
    order_type VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,
    quantity DECIMAL NOT NULL,
    price DECIMAL,
    time_in_force VARCHAR(10) NOT NULL,
    stop_loss DECIMAL,
    take_profit DECIMAL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    filled_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

3. API Endpoints:

```python
@orders_router.post("/orders")
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new order"""
    pass

@orders_router.put("/orders/{order_id}")
async def modify_order(
    order_id: str,
    modifications: OrderModify,
    current_user: User = Depends(get_current_user)
):
    """Modify an existing order"""
    pass

@orders_router.delete("/orders/{order_id}")
async def cancel_order(
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """Cancel an order"""
    pass

@orders_router.get("/orders/{order_id}")
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get order details"""
    pass

@orders_router.get("/orders")
async def list_orders(
    status: Optional[List[OrderStatus]] = Query(None),
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """List orders with optional filtering"""
    pass
```

### Acceptance Criteria
- [ ] Order creation functionality implemented and tested
- [ ] Order modification functionality implemented and tested
- [ ] Order cancellation functionality implemented and tested
- [ ] Order querying and filtering implemented
- [ ] Database schema created with proper indexes
- [ ] API endpoints implemented with proper validation
- [ ] WebSocket notifications for order updates implemented
- [ ] Error handling and logging implemented
- [ ] Unit tests written for all service methods
- [ ] Integration tests added for API endpoints
- [ ] Documentation updated with API specifications

### Dependencies
- VZX-BE-1-2-1: Trading Service Implementation
- Database migrations for order schema

### Testing Requirements
1. Unit Tests:
   - Order validation logic
   - Service method implementations
   - Error handling scenarios
   - Database operations

2. Integration Tests:
   - API endpoint functionality
   - Database interactions
   - Broker integration
   - WebSocket notifications

3. Load Tests:
   - Concurrent order creation
   - Order listing performance
   - WebSocket broadcast performance

### Security Considerations
- Implement proper user authentication
- Validate all input data
- Implement rate limiting
- Add audit logging for all order operations
- Secure storage of broker credentials
- Implement proper error handling without exposing internals

### Related Resources
- [Flask API Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [WebSocket Implementation Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Project API Documentation](mdc:.project/docs/api/trading-api.md) 