## VZX-BE-1-3-1: Implement Strategy Management Service

**Priority:** High
**Type:** Feature
**Assignee:** Backend Developer
**Status:** Todo

### Description
Implement a comprehensive strategy management service that handles the creation, validation, testing, and execution of trading strategies. This service will process strategy configurations, manage strategy lifecycle, and provide backtesting capabilities.

### Technical Requirements

1. Core Strategy Service:

```python
from typing import Dict, List, Optional
from datetime import datetime
from decimal import Decimal
from enum import Enum

class StrategyType(Enum):
    TECHNICAL = "TECHNICAL"
    FUNDAMENTAL = "FUNDAMENTAL"
    CUSTOM = "CUSTOM"

class StrategyStatus(Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    TESTING = "TESTING"
    ERROR = "ERROR"

class StrategyService:
    def __init__(
        self,
        db: Database,
        broker_service: BrokerService,
        market_data_service: MarketDataService
    ):
        self.db = db
        self.broker_service = broker_service
        self.market_data_service = market_data_service
        self.logger = logging.getLogger("viewzenix.strategy")

    async def create_strategy(
        self,
        user_id: str,
        strategy_data: Dict[str, any]
    ) -> Dict[str, any]:
        """
        Create a new trading strategy
        
        Args:
            user_id: User ID
            strategy_data: Strategy configuration
            
        Returns:
            Created strategy object
            
        Raises:
            ValidationError: If strategy configuration is invalid
        """
        try:
            # Validate strategy configuration
            validated_data = self._validate_strategy_config(strategy_data)
            
            # Create strategy in database
            strategy = await self.db.strategies.create({
                "user_id": user_id,
                "name": validated_data["name"],
                "description": validated_data["description"],
                "symbols": validated_data["symbols"],
                "timeframe": validated_data["timeframe"],
                "conditions": validated_data["conditions"],
                "entry_rules": validated_data["entry_rules"],
                "exit_rules": validated_data["exit_rules"],
                "risk_settings": validated_data["risk_settings"],
                "status": StrategyStatus.INACTIVE.value
            })
            
            return strategy
            
        except Exception as e:
            self.logger.error(f"Strategy creation failed: {e}")
            raise

    async def backtest_strategy(
        self,
        strategy_id: str,
        parameters: Dict[str, any]
    ) -> Dict[str, any]:
        """Run strategy backtest"""
        try:
            # Get strategy configuration
            strategy = await self.db.strategies.get(strategy_id)
            
            # Get historical data
            historical_data = await self._get_historical_data(
                strategy["symbols"],
                parameters["start_date"],
                parameters["end_date"],
                strategy["timeframe"]
            )
            
            # Run backtest simulation
            results = await self._run_backtest_simulation(
                strategy,
                historical_data,
                parameters["initial_capital"]
            )
            
            # Store results
            await self.db.backtest_results.create({
                "strategy_id": strategy_id,
                "parameters": parameters,
                "results": results,
                "timestamp": datetime.utcnow()
            })
            
            return results
            
        except Exception as e:
            self.logger.error(f"Strategy backtest failed: {e}")
            raise

    async def activate_strategy(
        self,
        strategy_id: str
    ) -> Dict[str, any]:
        """Activate strategy for live trading"""
        pass

    def _validate_strategy_config(
        self,
        config: Dict[str, any]
    ) -> Dict[str, any]:
        """Validate strategy configuration"""
        pass

    async def _run_backtest_simulation(
        self,
        strategy: Dict[str, any],
        historical_data: List[Dict[str, any]],
        initial_capital: Decimal
    ) -> Dict[str, any]:
        """Run backtest simulation"""
        pass
```

2. Technical Analysis Engine:

```python
class TechnicalAnalysis:
    def __init__(self, market_data_service: MarketDataService):
        self.market_data = market_data_service
        self.logger = logging.getLogger("viewzenix.technical_analysis")

    async def calculate_indicators(
        self,
        data: List[Dict[str, any]],
        indicators: List[Dict[str, any]]
    ) -> Dict[str, List[float]]:
        """Calculate technical indicators"""
        try:
            results = {}
            for indicator in indicators:
                if indicator["type"] == "SMA":
                    results[f"SMA_{indicator['period']}"] = self._calculate_sma(
                        data,
                        indicator["period"]
                    )
                elif indicator["type"] == "EMA":
                    results[f"EMA_{indicator['period']}"] = self._calculate_ema(
                        data,
                        indicator["period"]
                    )
                # Add more indicators...
            
            return results
            
        except Exception as e:
            self.logger.error(f"Indicator calculation failed: {e}")
            raise

    def _calculate_sma(
        self,
        data: List[Dict[str, any]],
        period: int
    ) -> List[float]:
        """Calculate Simple Moving Average"""
        pass

    def _calculate_ema(
        self,
        data: List[Dict[str, any]],
        period: int
    ) -> List[float]:
        """Calculate Exponential Moving Average"""
        pass
```

3. Database Schema:

```sql
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    symbols TEXT[] NOT NULL,
    timeframe VARCHAR(20) NOT NULL,
    conditions JSONB NOT NULL,
    entry_rules JSONB NOT NULL,
    exit_rules JSONB NOT NULL,
    risk_settings JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE backtest_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id UUID NOT NULL REFERENCES strategies(id),
    parameters JSONB NOT NULL,
    results JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_strategies_user_id ON strategies(user_id);
CREATE INDEX idx_strategies_status ON strategies(status);
CREATE INDEX idx_backtest_results_strategy_id ON backtest_results(strategy_id);
```

4. API Endpoints:

```python
@strategy_router.post("/strategies")
async def create_strategy(
    strategy_data: StrategyCreate,
    current_user: User = Depends(get_current_user)
):
    """Create new strategy"""
    pass

@strategy_router.get("/strategies")
async def list_strategies(
    current_user: User = Depends(get_current_user)
):
    """List user's strategies"""
    pass

@strategy_router.post("/strategies/{strategy_id}/backtest")
async def run_backtest(
    strategy_id: str,
    parameters: BacktestParameters,
    current_user: User = Depends(get_current_user)
):
    """Run strategy backtest"""
    pass

@strategy_router.post("/strategies/{strategy_id}/activate")
async def activate_strategy(
    strategy_id: str,
    current_user: User = Depends(get_current_user)
):
    """Activate strategy for live trading"""
    pass
```

### Acceptance Criteria
- [ ] Strategy management service implemented
- [ ] Strategy validation working
- [ ] Backtesting engine implemented
- [ ] Technical analysis engine working
- [ ] Strategy activation/deactivation working
- [ ] Database schema created
- [ ] API endpoints implemented
- [ ] Error handling implemented
- [ ] Unit tests written
- [ ] Integration tests passing
- [ ] Documentation updated

### Dependencies
- VZX-BE-1-2-1: Trading Service Implementation
- VZX-BE-1-2-2: Order Management Service
- VZX-BE-1-2-3: Broker Integration Layer

### Testing Requirements
1. Unit Tests:
   - Strategy validation
   - Technical analysis
   - Backtesting engine
   - Strategy management

2. Integration Tests:
   - Strategy creation flow
   - Backtesting process
   - Strategy activation
   - Data persistence

3. Performance Tests:
   - Backtesting performance
   - Technical analysis speed
   - Strategy execution
   - Database operations

### Security Considerations
- Validate strategy parameters
- Secure strategy storage
- Access control
- Rate limiting
- Error handling
- Audit logging
- Data validation
- Resource limits

### Related Resources
- [TA-Lib Documentation](https://ta-lib.org/d_api/d_api.html)
- [Backtesting Best Practices](https://www.investopedia.com/articles/trading/05/030205.asp)
- [Project Strategy Guide](mdc:.project/docs/trading/strategy-configuration.md)
- [API Documentation](mdc:.project/docs/api/strategy-management.md) 