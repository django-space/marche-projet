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
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    MarcheSerializer, CreateMarcheSerializer,
    OperationServiceSerializer, 
    DecompteSerializer,
)


class MarcheViewSet(viewsets.ModelViewSet, PageNumberPagination):
    queryset = Marche.objects.all()
    permission_classes = (IsAuthenticated,)

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

    @action(detail=True, methods=['get'], serializer_class=DecompteSerializer)
    def decomptes(self, request, pk):
        try:
            marche = Marche.objects.get(n_marche=pk)
            marche_decomptes = marche.decomptes.all()
            results = self.paginate_queryset(marche_decomptes)
            ser_marche_decomptes = DecompteSerializer(results, many=True)
            return self.get_paginated_response(ser_marche_decomptes.data)
        except:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], serializer_class=OperationServiceSerializer)
    def os(self, request, pk):
        try:
            marche = Marche.objects.get(n_marche=pk)
            marche_os = marche.operation_services.all()
            results = self.paginate_queryset(marche_os)
            ser_marche_os = OperationServiceSerializer(results, many=True)
            return self.get_paginated_response(ser_marche_os.data)
        except:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class OperationServiceViewSet(viewsets.ModelViewSet):
    queryset = OperationService.objects.all()
    serializer_class = OperationServiceSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        post_data = self.get_serializer_class()(data=request.data)
        if not post_data.is_valid():
            return Response(post_data.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            marche = Marche.objects.get(n_marche=post_data.validated_data['n_marche'])
            new_os = post_data.save(marche=marche)
            ser_new_os = self.get_serializer_class()(new_os)
            return Response(ser_new_os.data, status=status.HTTP_201_CREATED)
        except:
            return Response({'detail': "marche deosn't exist"}, status=status.HTTP_404_NOT_FOUND)


class DecompteViewSet(viewsets.ModelViewSet):
    queryset = Decompte.objects.all()
    serializer_class = DecompteSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        post_data = self.get_serializer_class()(data=request.data)
        if not post_data.is_valid():
            return Response(post_data.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            marche = Marche.objects.get(n_marche=post_data.validated_data['n_marche'])
            new_decompte = post_data.save(marche=marche)
            ser_new_decompte = self.get_serializer_class()(new_decompte)
            return Response(ser_new_decompte.data, status=status.HTTP_201_CREATED)
        except:
            return Response({'detail': "marche deosn't exist"}, status=status.HTTP_404_NOT_FOUND)
