"""
Compatibility shim.
Keep imports working for code expecting: app.routers.v1.api_v1.api_v1_router
"""

from ..api_v1 import api_v1_router  # re-export


