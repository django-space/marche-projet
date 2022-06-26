from django.contrib import admin
from .models import (
    Marche,
    OperationService,
    Decompte
)

admin.site.register(Marche)
admin.site.register(OperationService)
admin.site.register(Decompte)
