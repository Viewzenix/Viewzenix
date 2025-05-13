## VZX-BE-1-2-5: Create Analytics Service

**Priority:** High
**Type:** Feature
**Assignee:** Backend Developer
**Status:** Todo

### Description
Implement a comprehensive analytics service that processes trading data, calculates performance metrics, and provides historical analysis capabilities. This service will handle data aggregation, metric calculations, and real-time analytics updates for the trading platform.

### Technical Requirements

1. Core Analytics Service:

```python
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from decimal import Decimal
from enum import Enum

class TimeRange(Enum):
    DAY = "DAY"
    WEEK = "WEEK"
    MONTH = "MONTH"
    YEAR = "YEAR"
    ALL = "ALL"

class AnalyticsService:
    def __init__(self, db: Database, broker_service: BrokerService):
        self.db = db
        self.broker_service = broker_service
        self.logger = logging.getLogger("viewzenix.analytics")

    async def calculate_performance_metrics(
        self,
        user_id: str,
        time_range: TimeRange
    ) -> Dict[str, any]:
        """
        Calculate performance metrics for the specified time range
        
        Args:
            user_id: User ID
            time_range: Time range for calculations
            
        Returns:
            Dictionary containing performance metrics
        """
        try:
            # Get trade history for the period
            trades = await self._get_trade_history(user_id, time_range)
            
            # Calculate basic metrics
            total_trades = len(trades)
            successful_trades = len([t for t in trades if t["pnl"] > 0])
            failed_trades = total_trades - successful_trades
            
            # Calculate PnL metrics
            total_pnl = sum(t["pnl"] for t in trades)
            wins = [t["pnl"] for t in trades if t["pnl"] > 0]
            losses = [t["pnl"] for t in trades if t["pnl"] < 0]
            
            metrics = {
                "totalPnL": total_pnl,
                "winRate": successful_trades / total_trades if total_trades > 0 else 0,
                "averageWin": sum(wins) / len(wins) if wins else 0,
                "averageLoss": sum(losses) / len(losses) if losses else 0,
                "profitFactor": abs(sum(wins) / sum(losses)) if losses else float('inf'),
                "sharpeRatio": self._calculate_sharpe_ratio(trades),
                "maxDrawdown": self._calculate_max_drawdown(trades),
                "tradeCount": total_trades,
                "successfulTrades": successful_trades,
                "failedTrades": failed_trades,
                "period": time_range.value
            }
            
            return metrics
            
        except Exception as e:
            self.logger.error(f"Performance calculation failed: {e}")
            raise

    async def get_position_distribution(
        self,
        user_id: str
    ) -> List[Dict[str, any]]:
        """Get current position distribution analysis"""
        try:
            # Get current positions
            positions = await self.broker_service.get_positions(user_id)
            total_equity = sum(p["market_value"] for p in positions)
            
            # Calculate distribution metrics
            distribution = []
            for position in positions:
                distribution.append({
                    "symbol": position["symbol"],
                    "quantity": position["quantity"],
                    "marketValue": position["market_value"],
                    "unrealizedPnL": position["unrealized_pnl"],
                    "allocationPercentage": (position["market_value"] / total_equity * 100),
                    "riskScore": await self._calculate_position_risk(position)
                })
            
            return distribution
            
        except Exception as e:
            self.logger.error(f"Position distribution calculation failed: {e}")
            raise

    def _calculate_sharpe_ratio(
        self,
        trades: List[Dict[str, any]]
    ) -> float:
        """Calculate Sharpe ratio"""
        pass

    def _calculate_max_drawdown(
        self,
        trades: List[Dict[str, any]]
    ) -> float:
        """Calculate maximum drawdown"""
        pass

    async def _calculate_position_risk(
        self,
        position: Dict[str, any]
    ) -> float:
        """Calculate risk score for a position"""
        pass
```

2. Historical Data Analysis:

```python
class HistoricalAnalysis:
    def __init__(self, db: Database):
        self.db = db
        self.logger = logging.getLogger("viewzenix.historical_analysis")

    async def analyze_trading_patterns(
        self,
        user_id: str,
        time_range: TimeRange
    ) -> Dict[str, any]:
        """Analyze historical trading patterns"""
        try:
            trades = await self._get_trade_history(user_id, time_range)
            
            analysis = {
                "timeOfDay": self._analyze_time_patterns(trades),
                "dayOfWeek": self._analyze_day_patterns(trades),
                "symbolPerformance": self._analyze_symbol_performance(trades),
                "strategyPerformance": self._analyze_strategy_performance(trades)
            }
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Pattern analysis failed: {e}")
            raise

    def _analyze_time_patterns(
        self,
        trades: List[Dict[str, any]]
    ) -> Dict[str, any]:
        """Analyze trading patterns by time of day"""
        pass

    def _analyze_day_patterns(
        self,
        trades: List[Dict[str, any]]
    ) -> Dict[str, any]:
        """Analyze trading patterns by day of week"""
        pass
```

3. Database Schema:

```sql
CREATE TABLE trade_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    symbol VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,
    quantity DECIMAL NOT NULL,
    entry_price DECIMAL NOT NULL,
    exit_price DECIMAL,
    pnl DECIMAL,
    entry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    exit_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL,
    strategy VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    metrics JSONB NOT NULL,
    time_range VARCHAR(20) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trade_history_user_id ON trade_history(user_id);
CREATE INDEX idx_trade_history_entry_time ON trade_history(entry_time);
CREATE INDEX idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX idx_performance_metrics_calculated_at ON performance_metrics(calculated_at);
```

4. API Endpoints:

```python
@analytics_router.get("/performance")
async def get_performance_metrics(
    time_range: TimeRange,
    current_user: User = Depends(get_current_user)
):
    """Get performance metrics"""
    pass

@analytics_router.get("/positions/distribution")
async def get_position_distribution(
    current_user: User = Depends(get_current_user)
):
    """Get position distribution analysis"""
    pass

@analytics_router.get("/patterns")
async def get_trading_patterns(
    time_range: TimeRange,
    current_user: User = Depends(get_current_user)
):
    """Get trading pattern analysis"""
    pass

@analytics_router.get("/history")
async def get_trade_history(
    start_date: datetime,
    end_date: datetime,
    symbol: Optional[str] = None,
    strategy: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get filtered trade history"""
    pass
```

### Acceptance Criteria
- [ ] Analytics service implemented
- [ ] Performance metrics calculation working
- [ ] Position distribution analysis implemented
- [ ] Historical data analysis working
- [ ] Trading pattern analysis implemented
- [ ] API endpoints implemented
- [ ] Database schema created
- [ ] Real-time updates working
- [ ] Unit tests written
- [ ] Integration tests passing
- [ ] Documentation updated

### Dependencies
- VZX-BE-1-2-1: Trading Service Implementation
- VZX-BE-1-2-2: Order Management Service
- VZX-BE-1-2-3: Broker Integration Layer

### Testing Requirements
1. Unit Tests:
   - Metric calculations
   - Pattern analysis
   - Data aggregation
   - Performance calculations

2. Integration Tests:
   - Data flow
   - Real-time updates
   - API endpoints
   - Database operations

3. Performance Tests:
   - Large dataset handling
   - Calculation speed
   - Query optimization
   - Real-time performance

### Security Considerations
- Data access control
- Secure calculations
- Rate limiting
- Input validation
- Error handling
- Audit logging
- Data privacy
- Access authorization

### Related Resources
- [Financial Metrics Guide](https://www.investopedia.com/terms/t/technical-analysis-of-stocks-and-trends.asp)
- [Trading Analytics Best Practices](https://www.mathworks.com/help/finance/technical-analysis.html)
- [Project Analytics Guide](mdc:.project/docs/trading/analytics.md)
- [API Documentation](mdc:.project/docs/api/analytics.md) 