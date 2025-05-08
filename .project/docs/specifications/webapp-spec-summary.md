---
title: "Trading Webhook Platform – Specification Summary"
created: "2024-05-08"
updated: "2024-05-08"
version: "1.0.0"
tags: ["specification", "architecture", "api", "requirements", "technical-design"]
---

# Trading Webhook Platform – Specification Summary

## Project Scope & Objectives
- **Deterministic, broker-agnostic trade execution** from TradingView alerts through a Flask API gateway
- **Feature-rich React dashboard** with minimal-click access, hover tool-tips, and advanced toggles
- **Bullet-proof automated & manual test harnesses** runnable when markets are closed
- **Granular fail-safes** (order-level & global SL/TP, broker restrictions, portfolio circuit-breakers)
- **Extensible design** (modular adapters, clean domain layer, multi-user guard-rails)

## High-Level Architecture
```
TradingView ─────▶ Flask Webhook API
                   │
                   ├─▶ 1. Trade Router
                   │     • Validates & normalises alert JSON
                   │     • Classifies asset, trade type, order size
                   │
                   ├─▶ 2. Order Engine
                   │     • AlpacaAdapter  (today)
                   │     • <FutureBroker>Adapter
                   │
                   ├─▶ 3. Risk & Compliance
                   │     • Per‑order SL/TP
                   │     • Global SL/TP tracker (async every 10 s)
                   │
                   ├─▶ 4. Cleanup Service
                   │     • /status   (auto, every 30 s)
                   │     • /cleanup  (manual)
                   │
                   ├─▶ 5. Logging Bus
                   │     • logs.jsonl  (webhook ↔ broker)
                   │     • activity.log (positions, equity, bot state)
                   │
                   ├─▶ 6. Test Harness
                   │     • pytest scripts + Postman collection
                   │
                   └─▶ 7. React Front‑End (Next.js or CRA)
                         • Tabs: Webhook Setup ∣ Brokers ∣ Bots ∣ Logs ∣ Analytics
                         • REST/WS to Flask; Role‑based auth (future)
```

## Core Modules & Responsibilities

| # | Module | Key Responsibilities | Notes |
|---|--------|----------------------|-------|
| 1 | **Webhook Receiver** | Validate HMAC (future), enforce fixed JSON schema, enqueue job | Flask blueprint `/webhook` |
| 2 | **Trade Classifier** | `get_asset_class(symbol)` → _crypto ∣ equity ∣ forex ∣ unknown_ | 26 unit tests cover slashes, dots, dashes |
| 3 | **Order Engine** | Decide order type, size, side; call `AlpacaAdapter.place_order()` | Default **market**; limit/stop/bracket via UI toggle |
| 4 | **Per-Order SL/TP** | After entry fill (or alert price), place OCO legs; tag `-sl` & `-tp` | Toggle for fill-price vs alert-price basis |
| 5 | **Cleanup Service** | Auto & manual removal of orphaned SL/TP orders | Runs even when markets are closed |
| 6 | **Global SL/TP Tracker** | Portfolio-level equity circuit-breaker every 10 s | Thresholds persisted; bot paused/resumed |
| 7 | **Broker Restrictions** | Block crypto-shorts & all forex when `CURRENT_BROKER == "alpaca"` | Adapter-specific constraints |
| 8 | **Logging Bus** | Append every inbound alert & outbound broker response | `logs.jsonl` (machine) & `activity.log` (human) |
| 9 | **Test Suite** | pytest + Postman; mocks broker calls | Runs fully offline |
|10 | **React UI** | Advanced settings panel per bot; creative dashboard | Fly.io private deployment |

## TradingView Alert Schema
```json
{
  "symbol": "BTCUSD",
  "strategy_order_id": "long",
  "strategy_order_action": "buy",
  "strategy_order_contracts": 0.05,
  "strategy_order_price": 64340.15,
  "strategy_order_comment": "Breakout",
  "time": 1713746400000
}
```

## Trade-Type Mapping

| strategy_order_id | strategy_order_action | Result |
|-------------------|-----------------------|--------|
| long | buy  | **Long Entry** |
| long | sell | **Long Exit** |
| sell | sell | **Short Entry** |
| sell | buy  | **Short Exit** |

*Exit orders ignore size and call `DELETE /v2/positions/{symbol}`.*

## Order Sizing Options
1. **Percentage of equity** (default per-bot)
2. **Contracts from TradingView** – UI checkbox enables `strategy_order_contracts`
3. **Notional** – Alpaca `notional` field for dollar-based orders
4. **Fractional shares / coins** fully supported

## Client-Order-ID Convention
```
{bot_id}-{timestamp}-{uuid}{-sl|-tp}
```
Suffix `-sl` or `-tp` is mandatory for cleanup detection.

## SL/TP Cleanup Algorithm
1. Pull open positions
2. Get all open orders whose `client_order_id` ends in `-sl` or `-tp`
3. If the order's symbol has **no position**, cancel it
4. Log result

## Global SL/TP Implementation
- Enable via UI configuration
- System writes config like `{ "glb_sl": 0.80, "glb_tp": 1.20, "base_equity": 100000, "active": true }`
- Async polling every 10 seconds
- Trigger SL: Equity ≤ `base_equity * glb_sl` → bulk liquidate, pause bot
- Trigger TP: Equity ≥ `base_equity * glb_tp` → optional liquidation, resume
- Reset thresholds on config edit

## Testing Strategy
| Phase | Focus | Script |
|-------|-------|--------|
| 0 | JSON schema validation | `test_webhooks_schema.py` |
| 1 | Asset detection & broker blocking | `test_assets.py` |
| 2 | Trade-type logic, fallback sizing | `test_trade_types.py` |
| 3 | SL/TP cleanup | `test_cleanup.py` |
| 4 | Limit order dual-mode | `test_limit_orders.py` |
| 5 | Global SL/TP | `test_global_sl_tp.py` |

## Configuration Keys

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `base_order_pct` | float | `0.02` | Percent equity per entry |
| `use_limit_orders` | bool | `false` | Master toggle |
| `use_strategy_order_price` | bool | `true` | Source price for non-market |
| `limit_offset_ticks` | int | `0` | Positive/negative integer |
| `attach_sl_tp` | bool | `false` | Per-order SL/TP legs |
| `sl_pct` | float | `0.01` | Stop-loss % |
| `tp_pct` | float | `0.02` | Take-profit % |
| `use_avg_fill_for_sl_tp` | bool | `true` | Wait 5 s & pull avg fill |
| `enable_global_sl_tp` | bool | `false` | Portfolio circuit breaker |
| `global_sl_pct` | float | `0.80` | 80% of base equity |
| `global_tp_pct` | float | `1.20` | 120% of base equity |

## Security & Deployment
- **Hosting**: Fly.io with private networking; only whitelisted IPs hit Flask
- **Secrets**: Fly secrets store / Pulumi; never hard-code
- **Logs**: Centralized; archive to private S3
- **AuthN/Z (future)**: JWT + RBAC (`admin`, `viewer`)
- **CI/CD**: GitHub Actions → Fly deploy; pytest must pass

## Future Road-Map
1. Multi-tenant workspaces & per-user API keys
2. AI Insight panel: latency & performance analytics
3. Live WebSocket broker feed in React
4. Pluggable broker adapters (IBKR, Binance)
5. Auto-generated TradingView alert builders with QR share 