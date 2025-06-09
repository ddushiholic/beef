from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import basic_views

urlpatterns = [
    path('', basic_views.evaluate_random, name='index'),

    path('accounts/signup', basic_views.signup, name='signup'),
    path('accounts/login', basic_views.login, name='login'),
    path('accounts/logout', basic_views.logout, name='logout'),

    path('evaluate-random/', basic_views.evaluate_random, name='evaluate_random'),
    path('evaluate/<str:cow_data>/<str:action>/', basic_views.evaluate_detail, name='evaluate_detail'),

    path('fineness', basic_views.fineness_index, name='fineness_index'),
    path('fineness/upload', basic_views.get_fineness, name='calculate_fineness'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
