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
    class Meta:
        model = OperationService
        fields = '__all__'


class DecompteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Decompte
        fields = '__all__'
