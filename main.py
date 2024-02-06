from fastapi import FastAPI
from fastapi.routing import APIRoute, APIRouter
from starlette.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from api.router.first_router import parsing_router
from api.pages.router import pages_router


app = FastAPI(title='Covid-19 API')
app.mount('/static', StaticFiles(directory='api/static'), name='static')
router = APIRouter(prefix='/api/v1')

def create_app() -> FastAPI:
    router.include_router(parsing_router)
    app.include_router(router)
    app.include_router(pages_router)
    app.add_middleware(SessionMiddleware, secret_key='very_secret_key', max_age=None)
    return app