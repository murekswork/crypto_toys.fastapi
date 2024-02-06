from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

pages_router = APIRouter(prefix='', tags=['Pages'])

templates = Jinja2Templates(directory='api/templates')


@pages_router.get('/')
def get_base_page(request: Request):
    return templates.TemplateResponse('base.html', {'request': request})