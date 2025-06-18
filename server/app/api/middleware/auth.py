# import jwt
# from app.core.config.config import SECRET_KEY
# from app.core.security.jwt_handler import decode_token
# from starlette.datastructures import Headers
# from starlette.requests import Request as StarletteRequest
# from starlette.responses import JSONResponse
# from starlette.types import ASGIApp, Receive, Scope, Send

# API_PREFIX = "/api/v1"


# class AuthenticationMiddleware:
#     def __init__(
#         self,
#         app: ASGIApp,
#         excluded_paths: list | None = None,
#         secret_key: str | None = None,
#     ) -> None:
#         self.app = app

#         self.excluded_paths = [
#             f"{API_PREFIX}/docs",
#             f"{API_PREFIX}/redoc",
#             "/openapi.json",
#             f"{API_PREFIX}/health",
#             f"{API_PREFIX}/login",
#             f"{API_PREFIX}/register",
#         ]
#         print(excluded_paths)
#         self.secret_key = secret_key or SECRET_KEY

#     async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
#         if scope["type"] != "http":
#             await self.app(scope, receive, send)
#             return

#         # Create request object to access headers and path
#         request = StarletteRequest(scope, receive)
#         headers = Headers(scope=scope)

#         # Skip authentication for excluded paths
#         path = scope.get("path", "")
#         if any(path.startswith(excluded_path) for excluded_path in self.excluded_paths):
#             await self.app(scope, receive, send)
#             return

#         # Get authorization header
#         auth_header = headers.get("Authorization")

#         if not auth_header or not auth_header.startswith("Bearer "):
#             response = JSONResponse(
#                 status_code=401,
#                 content={"detail": "Missing or invalid authorization header"},
#             )
#             await response(scope, receive, send)
#             return

#         # Extract token
#         token = auth_header.split(" ")[1]

#         try:
#             # Verify and decode JWT token
#             payload = decode_token(token, SECRET_KEY)  # type:ignore
#             user_id = payload.get("email")
#             if user_id is None:
#                 response = JSONResponse(
#                     status_code=401,
#                     content={
#                         "detail": "Invalid token",
#                     },
#                 )
#                 await response(scope, receive, send)
#                 return

#             scope["user"] = {
#                 "user_id": user_id,
#                 "email": payload.get("email"),
#                 "exp": payload.get("exp"),
#             }

#         except jwt.ExpiredSignatureError:
#             response = JSONResponse(
#                 status_code=401,
#                 content={
#                     "detail": "Token has expired",
#                 },
#             )
#             await response(scope, receive, send)
#             return

#         except jwt.InvalidTokenError:
#             response = JSONResponse(
#                 status_code=401,
#                 content={
#                     "detail": "Invalid token",
#                 },
#             )
#             await response(scope, receive, send)
#             return

#         await self.app(scope, receive, send)
