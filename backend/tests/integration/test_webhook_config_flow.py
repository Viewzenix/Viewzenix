import pytest
from app import create_app
from app.extensions import db

@pytest.fixture
def app():
    """Create and configure a Flask app for integration testing."""
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Test client for the Flask app."""
    return app.test_client()


def test_webhook_config_full_flow(client):
    """Integration test covering full CRUD and toggle flow for webhook configurations."""
    # 1. Initial GET should return empty list
    response = client.get('/webhooks')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data['data'], list)
    assert data['data'] == []

    # 2. Create a new webhook configuration
    create_payload = {
        "name": "Flow Strategy",
        "description": "Integration test",
        "securityToken": "tokenflow123",
        "notificationPreferences": {
            "email": False,
            "browser": False,
            "onSuccess": True,
            "onFailure": False
        },
        "isActive": True
    }
    response = client.post('/webhooks', json=create_payload)
    assert response.status_code == 201
    resp_data = response.get_json()
    assert resp_data['status'] == 'success'
    new_id = resp_data['data']['webhook']['id']

    # 3. Retrieve the created configuration
    response = client.get(f'/webhooks/{new_id}')
    assert response.status_code == 200
    assert response.get_json()['data']['id'] == new_id

    # 4. Update the configuration name
    update_payload = {"name": "Flow Strategy Updated"}
    response = client.put(f'/webhooks/{new_id}', json=update_payload)
    assert response.status_code == 200
    assert response.get_json()['data']['webhook']['name'] == "Flow Strategy Updated"

    # 5. Toggle isActive off then on
    response = client.patch(f'/webhooks/{new_id}/toggle', json={"isActive": False})
    assert response.status_code == 200
    assert response.get_json()['data']['webhook']['isActive'] is False

    response = client.patch(f'/webhooks/{new_id}/toggle', json={"isActive": True})
    assert response.status_code == 200
    assert response.get_json()['data']['webhook']['isActive'] is True

    # 6. Delete the configuration
    response = client.delete(f'/webhooks/{new_id}')
    assert response.status_code == 200

    # 7. Confirm deletion
    response = client.get(f'/webhooks/{new_id}')
    assert response.status_code == 404
