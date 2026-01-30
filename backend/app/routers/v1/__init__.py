"""
Compatibility package.

Some environments/scripts may expect routers under app.routers.v1.
The canonical implementation lives in app/routers/api_v1.py.
"""

from ..api_v1 import api_v1_router  # re-export


