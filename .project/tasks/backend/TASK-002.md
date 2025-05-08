---
id: "TASK-002"
title: "Define /webhook route in a Flask Blueprint"
status: "todo" # backlog, todo, in-progress, review, done
priority: "high" # low, medium, high, critical
assignee: "backend-agent"
epic: "EPIC-1.1"
phase: "Phase 1"
created: "2024-05-08"
updated: "2024-05-08"
depends_on: ["TASK-001"]
tags: ["api", "flask", "webhook"]
---

# Define /webhook route in a Flask Blueprint

## Description
Create a Flask Blueprint for webhook handling and implement a basic route at `/webhook` that can receive POST requests from TradingView.

## Acceptance Criteria
- [ ] Create a separate Blueprint for webhook-related routes
- [ ] Implement a POST route at `/webhook`
- [ ] The route should accept and parse JSON payloads
- [ ] Return a 200 OK response with a simple success message
- [ ] Implement basic error handling for malformed requests
- [ ] Log all received webhook requests (minimal logging for now)

## Technical Details
The webhook Blueprint should be registered with the main Flask app created in TASK-001. The route implementation should follow this pattern:

```python
from flask import Blueprint, request, jsonify

webhook_bp = Blueprint('webhook', __name__, url_prefix='/api')

@webhook_bp.route('/webhook', methods=['POST'])
def receive_webhook():
    try:
        # Get JSON payload
        payload = request.get_json()
        
        # Log the request (basic logging for now)
        print(f"Received webhook: {payload}")
        
        # Return success response
        return jsonify({"status": "success", "message": "Webhook received"}), 200
        
    except Exception as e:
        # Handle errors
        return jsonify({"status": "error", "message": str(e)}), 400
```

## Dependencies
- TASK-001: The Flask application structure must be set up first

## Notes
This is an initial implementation that focuses on correctly receiving webhooks. In subsequent tasks, we'll add proper JSON schema validation and more sophisticated processing logic.

## Updates
- **2024-05-08**: Task created 