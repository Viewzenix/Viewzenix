## VZX-BE-1-2-4: Create Risk Management Service

**Priority:** High
**Type:** Feature
**Assignee:** Backend Developer
**Status:** Todo

### Description
Implement a comprehensive risk management service that enforces trading limits, monitors risk exposure, and provides real-time risk metrics. This service will ensure trading activities remain within defined risk parameters and provide alerts for potential risk threshold breaches.

### Technical Requirements

1. Core Risk Management Service:

```python
from typing import Dict, List, Optional
from datetime import datetime, time
from decimal import Decimal
from enum import Enum

class RiskLevel(Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class RiskManagementService:
    def __init__(self, db: Database, broker_service: BrokerService):
        self.db = db
        self.broker_service = broker_service
        self.logger = logging.getLogger("viewzenix.risk_management")

    async def validate_order(
        self,
        user_id: str,
        order_data: Dict[str, any]
    ) -> Dict[str, any]:
        """
        Validate order against risk parameters
        
        Args:
            user_id: User ID
            order_data: Order details
            
        Returns:
            Validation result with risk metrics
            
        Raises:
            RiskLimitError: If order exceeds risk limits
        """
        try:
            # Get user's risk settings
            settings = await self.get_risk_settings(user_id)
            
            # Get current positions and metrics
            positions = await self.broker_service.get_positions(user_id)
            metrics = await self.calculate_risk_metrics(user_id, positions)
            
            # Validate position size
            if not self._validate_position_size(order_data, settings, metrics):
                raise RiskLimitError("Order exceeds position size limit")
            
            # Validate daily loss limit
            if not self._validate_daily_loss(metrics, settings):
                raise RiskLimitError("Daily loss limit reached")
            
            # Validate other risk parameters
            self._validate_risk_parameters(order_data, settings, metrics)
            
            return {
                "valid": True,
                "metrics": metrics,
                "risk_level": self._calculate_risk_level(metrics, settings)
            }
            
        except Exception as e:
            self.logger.error(f"Risk validation failed: {e}")
            raise

    async def calculate_risk_metrics(
        self,
        user_id: str,
        positions: List[Dict[str, any]]
    ) -> Dict[str, any]:
        """Calculate current risk metrics"""
        try:
            # Get trading history
            history = await self.db.trades.get_daily_history(user_id)
            
            # Calculate metrics
            metrics = {
                "currentDrawdown": self._calculate_drawdown(history),
                "dailyPnL": self._calculate_daily_pnl(history),
                "openPositionsCount": len(positions),
                "totalExposure": self._calculate_total_exposure(positions),
                "marginUsage": self._calculate_margin_usage(positions),
                "dailyTradeCount": len(history),
                "lastUpdated": datetime.utcnow().isoformat()
            }
            
            return metrics
            
        except Exception as e:
            self.logger.error(f"Metrics calculation failed: {e}")
            raise

    def _calculate_risk_level(
        self,
        metrics: Dict[str, any],
        settings: Dict[str, any]
    ) -> RiskLevel:
        """Calculate current risk level"""
        pass

    def _validate_position_size(
        self,
        order: Dict[str, any],
        settings: Dict[str, any],
        metrics: Dict[str, any]
    ) -> bool:
        """Validate position size limits"""
        pass
```

2. Risk Settings Management:

```python
class RiskSettingsService:
    def __init__(self, db: Database):
        self.db = db
        self.logger = logging.getLogger("viewzenix.risk_settings")

    async def update_settings(
        self,
        user_id: str,
        settings: Dict[str, any]
    ) -> Dict[str, any]:
        """Update user's risk settings"""
        try:
            # Validate settings
            validated_settings = self._validate_settings(settings)
            
            # Store in database
            await self.db.risk_settings.update(
                user_id=user_id,
                settings=validated_settings
            )
            
            return validated_settings
            
        except Exception as e:
            self.logger.error(f"Failed to update risk settings: {e}")
            raise

    def _validate_settings(self, settings: Dict[str, any]) -> Dict[str, any]:
        """Validate risk settings"""
        pass
```

3. Database Schema:

```sql
CREATE TABLE risk_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    max_position_size DECIMAL NOT NULL,
    max_daily_loss DECIMAL NOT NULL,
    max_drawdown DECIMAL NOT NULL,
    max_leverage DECIMAL NOT NULL,
    stop_loss_percentage DECIMAL NOT NULL,
    take_profit_percentage DECIMAL NOT NULL,
    risk_reward_ratio DECIMAL NOT NULL,
    max_open_positions INTEGER NOT NULL,
    max_daily_trades INTEGER NOT NULL,
    trading_sessions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE risk_metrics_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    metrics JSONB NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_settings_user_id ON risk_settings(user_id);
CREATE INDEX idx_risk_metrics_user_id ON risk_metrics_history(user_id);
CREATE INDEX idx_risk_metrics_timestamp ON risk_metrics_history(timestamp);
```

4. API Endpoints:

```python
@risk_router.get("/settings")
async def get_risk_settings(
    current_user: User = Depends(get_current_user)
):
    """Get user's risk settings"""
    pass

@risk_router.put("/settings")
async def update_risk_settings(
    settings: RiskSettingsUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update risk settings"""
    pass

@risk_router.get("/metrics")
async def get_risk_metrics(
    current_user: User = Depends(get_current_user)
):
    """Get current risk metrics"""
    pass

@risk_router.get("/metrics/history")
async def get_risk_metrics_history(
    start_date: datetime,
    end_date: datetime,
    current_user: User = Depends(get_current_user)
):
    """Get historical risk metrics"""
    pass
```

### Acceptance Criteria
- [ ] Risk management service implemented
- [ ] Risk settings management working
- [ ] Risk metrics calculation implemented
- [ ] Position size validation working
- [ ] Daily loss limits enforced
- [ ] Risk level calculation working
- [ ] Trading session validation
- [ ] API endpoints implemented
- [ ] Database schema created
- [ ] Unit tests written
- [ ] Integration tests passing

### Dependencies
- VZX-BE-1-2-1: Trading Service Implementation
- VZX-BE-1-2-2: Order Management Service
- VZX-BE-1-2-3: Broker Integration Layer

### Testing Requirements
1. Unit Tests:
   - Risk calculations
   - Validation logic
   - Settings management
   - Metrics calculation

2. Integration Tests:
   - Order validation flow
   - Risk limit enforcement
   - Metrics tracking
   - API endpoints

3. Performance Tests:
   - Concurrent validations
   - Metrics calculation speed
   - Database operations

### Security Considerations
- Validate all input parameters
- Secure storage of settings
- Access control for risk data
- Audit logging for changes
- Rate limiting for updates
- Error handling security
- Data validation
- Transaction security

### Related Resources
- [Risk Management Documentation](https://www.investopedia.com/terms/r/riskmanagement.asp)
- [Financial Risk Modeling](https://www.mathworks.com/help/finance/risk.html)
- [Project Risk Management Guide](mdc:.project/docs/trading/risk-management.md)
- [API Documentation](mdc:.project/docs/api/risk-management.md) 