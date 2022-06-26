from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework import viewsets
from .models import (
    Marche,
    OperationService,
    Decompte
)
from rest_framework.generics import (
    CreateAPIView, RetrieveUpdateAPIView, UpdateAPIView,
    ListCreateAPIView, RetrieveAPIView, ListAPIView, GenericAPIView
)
from .serializers import (
    MarcheSerializer, CreateMarcheSerializer,
    OperationServiceSerializer, 
    DecompteSerializer,
)


class MarcheViewSet(viewsets.ModelViewSet):
    queryset = Marche.objects.all()
    # serializer_class = MarcheSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateMarcheSerializer
        else:
            return MarcheSerializer

    def create(self, request):
        post_data = self.get_serializer_class()(data=request.data)
        if not post_data.is_valid():
            return Response(post_data.errors, status=status.HTTP_400_BAD_REQUEST)

        new_marche = post_data.save()
        ser_new_marche = self.get_serializer_class()(new_marche)
        return Response(ser_new_marche.data, status=status.HTTP_201_CREATED)


class OperationServiceViewSet(viewsets.ModelViewSet):
    queryset = OperationService.objects.all()
    serializer_class = OperationServiceSerializer


class DecompteViewSet(viewsets.ModelViewSet):
    queryset = Decompte.objects.all()
    serializer_class = DecompteSerializer
