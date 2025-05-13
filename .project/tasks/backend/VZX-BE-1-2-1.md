## [VZX-BE-1-2-1] Implement Trading Service

**Priority:** Critical
**Type:** Feature
**Assignee:** Backend Agent
**Status:** Todo
**Milestone:** 1
**Phase:** 2

### Context
The Trading Service is a critical component that handles order execution and broker integration. Based on the compatibility reports, we need to implement a robust service that can reliably execute trades through various brokers while maintaining proper error handling and logging.

### Description
Implement a comprehensive Trading Service that manages order execution, position tracking, and broker integrations. This service will be responsible for executing trades received from webhooks and managing trading state.

### Technical Requirements

1. Service Structure:
   ```python
   # app/core/services/trading_service.py
   from typing import Optional, Dict, List
   from datetime import datetime
   from app.core.models import Order, Position, Trade
   from app.core.exceptions import TradingError
   
   class TradingService:
       def __init__(self, db_session, broker_adapter):
           self.db = db_session
           self.broker = broker_adapter
   
       async def execute_order(self, order_request: Dict) -> Order:
           """Execute a trading order"""
           try:
               # Validate order
               self.validate_order(order_request)
   
               # Check risk limits
               await self.check_risk_limits(order_request)
   
               # Execute through broker
               broker_response = await self.broker.execute_order(order_request)
   
               # Create order record
               order = Order(
                   user_id=order_request['user_id'],
                   symbol=order_request['symbol'],
                   side=order_request['side'],
                   quantity=order_request['quantity'],
                   order_type=order_request['type'],
                   status='FILLED',
                   broker_order_id=broker_response['id']
               )
   
               # Save to database
               self.db.add(order)
               await self.db.commit()
   
               # Update positions
               await self.update_positions(order)
   
               return order
   
           except Exception as e:
               await self.log_error(e, order_request)
               raise TradingError(str(e))
   
       async def get_positions(self, user_id: str) -> List[Position]:
           """Get current positions for user"""
           return await self.db.query(Position).filter(
               Position.user_id == user_id
           ).all()
   ```

2. Database Models:
   ```python
   # app/core/models/trading.py
   from sqlalchemy import Column, String, Float, Integer, Enum, DateTime
   from app.core.models.base import Base
   
   class Order(Base):
       __tablename__ = 'orders'
   
       id = Column(String, primary_key=True)
       user_id = Column(String, nullable=False)
       symbol = Column(String, nullable=False)
       side = Column(Enum('BUY', 'SELL'), nullable=False)
       quantity = Column(Float, nullable=False)
       price = Column(Float)
       order_type = Column(String, nullable=False)
       status = Column(String, nullable=False)
       broker_order_id = Column(String)
       created_at = Column(DateTime, default=datetime.utcnow)
   
   class Position(Base):
       __tablename__ = 'positions'
   
       id = Column(String, primary_key=True)
       user_id = Column(String, nullable=False)
       symbol = Column(String, nullable=False)
       quantity = Column(Float, nullable=False)
       average_entry = Column(Float, nullable=False)
       current_price = Column(Float)
       updated_at = Column(DateTime, default=datetime.utcnow)
   ```

3. Broker Integration:
   ```python
   # app/core/adapters/broker_adapter.py
   from abc import ABC, abstractmethod
   from typing import Dict
   
   class BrokerAdapter(ABC):
       @abstractmethod
       async def execute_order(self, order: Dict) -> Dict:
           pass
   
       @abstractmethod
       async def get_positions(self) -> List[Dict]:
           pass
   
   class AlpacaAdapter(BrokerAdapter):
       def __init__(self, api_key: str, api_secret: str):
           self.client = AlpacaClient(api_key, api_secret)
   
       async def execute_order(self, order: Dict) -> Dict:
           # Implementation
           pass
   ```

4. Risk Management:
   ```python
   # app/core/services/risk_service.py
   class RiskService:
       def __init__(self, db_session):
           self.db = db_session
   
       async def check_limits(self, order: Dict) -> bool:
           """Check if order meets risk criteria"""
           # Implementation
           pass
   ```

### Acceptance Criteria
- [ ] Trading service implemented
- [ ] Order execution working
- [ ] Position tracking working
- [ ] Risk management implemented
- [ ] Broker integration working
- [ ] Database models created
- [ ] Error handling implemented
- [ ] Logging system working
- [ ] Tests passing

### Dependencies
- [VZX-BE-1-1-1] Setup Flask API Structure
- [VZX-BE-1-1-4] Setup Error Handling

### Testing Requirements
1. Unit Tests:
   - Service methods
   - Order validation
   - Risk checks
   - Position calculations

2. Integration Tests:
   - Broker integration
   - Database operations
   - Error handling
   - Transaction rollback

3. Performance Tests:
   - Order execution latency
   - Concurrent orders
   - Database performance

### Security Considerations
- Order validation
- Position limits
- Risk management
- API key security
- Transaction security
- Audit logging
- Error handling security
- Data encryption

### Resources
- [Alpaca Trading API](https://alpaca.markets/docs/api-references/trading-api/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Financial System Design Patterns](https://martinfowler.com/articles/patterns-of-distributed-systems/) 