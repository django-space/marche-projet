from rest_framework import serializers
from uuid import uuid4
from .models import (
    Marche,
    OperationService,
    Decompte
)

class MarcheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marche
        fields = '__all__'
        read_only_fields = ('n_marche',)


class CreateMarcheSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        random_string = uuid4().hex
        new_marche = Marche.objects.create(
            n_marche=f"{random_string}-{validated_data['n_marche']}",
            objet_marche=validated_data['objet_marche'],
            montant_marche=validated_data['montant_marche'],
        )
        return new_marche

    class Meta:
        model = Marche
        fields = '__all__'


class OperationServiceSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        num_os = 1
        try:
            num_os = validated_data['marche'].operation_services.first().n_os + 1
        except:
            pass
        new_os = OperationService.objects.create(
            n_marche=validated_data['marche'],
            n_os=num_os,
            type_os=validated_data['type_os'],
        )
        return new_os

    class Meta:
        model = OperationService
        fields = '__all__'
        read_only_fields = ('n_os',)


class DecompteSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        num_decompte = 1
        try:
            num_decompte = validated_data['marche'].decomptes.first().n_decompte + 1
        except:
            pass
        new_decompte = Decompte.objects.create(
            n_marche=validated_data['marche'],
            n_decompte=num_decompte,
            montant_decmopte=validated_data['montant_decmopte'],
        )
        return new_decompte

    class Meta:
        model = Decompte
        fields = '__all__'
        read_only_fields = ('n_decompte',)


class FormulaSerializer(serializers.Serializer):
    formula = serializers.CharField(required=True)
    is_valid = serializers.BooleanField(read_only=True)


class FormulaVaiableSerializer(serializers.Serializer):
    variables = serializers.ListField(child=serializers.CharField())
