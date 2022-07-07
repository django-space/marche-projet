from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from main import views as main_views
from rest_framework.routers import DefaultRouter

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = DefaultRouter()
router.register(r'api/v1/marches', main_views.MarcheViewSet, basename='marche')
router.register(r'api/v1/decomptes', main_views.DecompteViewSet, basename='decompte')
router.register(r'api/v1/os', main_views.OperationServiceViewSet, basename='operation-services')
router.register(r'api/v1/formula', main_views.FormulaAPIView, basename='formula')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/v1/auth/', include('dj_rest_auth.urls')),
    *router.urls,
]
