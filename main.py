from fastapi import APIRouter, FastAPI
from starlette.middleware.sessions import SessionMiddleware
from starlette.staticfiles import StaticFiles

from api.pages.router import pages_router
from api.router.coin_router import coin_router
from api.router.session_router import session_router

app = FastAPI(title='api v.0.1', description='desc')
app.mount('/static', StaticFiles(directory='api/static'), name='static')
router = APIRouter(prefix='/api/v1')


def create_app() -> FastAPI:
    router.include_router(coin_router)
    app.include_router(router)
    app.include_router(session_router)
    app.include_router(pages_router)
    app.add_middleware(SessionMiddleware, secret_key='salt')
    return app
