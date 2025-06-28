from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_limiter.depends import RateLimiter

from app.dependencies.auth_dependencies import (
    get_auth_service,
    get_current_user,
    get_password_service,
)
from app.models.database.user_model import User
from app.schemas.request.auth_request import (
    PasswordResetConfirmIn,
    PasswordResetRequestIn,
    RefreshRequestIn,
    UserLoginIn,
    UserRegistrationIn,
)
from app.schemas.response.auth_response import (
    MessageOut,
    RefreshTokenOut,
    TokenPairOut,
    UserOut,
)
from app.services.auth.auth_service import AuthService, PasswordService

router = APIRouter(tags=["Auth"])


@router.post(
    "/login",
    response_model=TokenPairOut,
    dependencies=[
        Depends(RateLimiter(times=5, seconds=60)),
    ],
)
async def login(
    user: UserLoginIn,
    auth_service: AuthService = Depends(get_auth_service),
):
    tokens = await auth_service.login(
        email=user.email,
        password=user.password,
    )
    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    return TokenPairOut(**tokens)


@router.post(
    "/refresh",
    response_model=RefreshTokenOut,
    dependencies=[
        Depends(RateLimiter(times=10, seconds=60)),
    ],
)
def refresh_token(
    request: RefreshRequestIn,
    auth_service: AuthService = Depends(get_auth_service),
):
    new_access_token = auth_service.refresh(request.refresh_token)
    if not new_access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    return RefreshTokenOut(access_token=new_access_token, token_type="bearer")


@router.post(
    "/register",
    response_model=UserOut,
)
async def register(
    user_data: UserRegistrationIn,
    auth_service: AuthService = Depends(get_auth_service),
):
    registered_user = await auth_service.register(user_data=user_data)
    if registered_user:
        return UserOut(
            email=str(registered_user.email),
            first_name=str(registered_user.first_name),
            last_name=str(registered_user.last_name),
        )
    else:
        return


@router.post("/me", response_model=UserOut)
async def get_current_user_endpoint(
    current_user: User = Depends(get_current_user),
):
    return UserOut(
        email=str(current_user.email),
        first_name=str(current_user.first_name),
        last_name=str(current_user.last_name),
    )


@router.post("/password-reset/request", response_model=MessageOut)
async def request_password_reset(
    payload: PasswordResetRequestIn,
    password_service: PasswordService = Depends(get_password_service),
):
    await password_service.reset_token(email=str(payload.email))
    return MessageOut(message="successfully sent")


@router.post("/password-reset/confim", response_model=MessageOut)
async def confirm_password_reset(
    payload: PasswordResetConfirmIn,
    password_service: PasswordService = Depends(get_password_service),
):
    await password_service.change_password(
        password=payload.password,
        token=payload.token,
    )

    return MessageOut(message="password reset successfull")
