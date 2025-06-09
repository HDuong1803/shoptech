from src import create_app
from src.constants import logger
from src.constants.constants import CONSTANT

app = create_app()

if __name__ == '__main__':
    port = int(CONSTANT['PORT']) if CONSTANT['PORT'] else 5000
    app.run(debug=True, host='0.0.0.0', port=port)
    logger.info(f"Server running on port {port}")