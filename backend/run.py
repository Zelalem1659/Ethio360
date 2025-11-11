from app import create_app, db
from flask_migrate import upgrade
import os

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
    
    # Run the application
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True
    )