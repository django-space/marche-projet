from django.db import models


class Marche(models.Model):
    n_marche = models.CharField(max_length=37, primary_key=True) # ex: 9b36785fbac04fa5b994e4ff40a3ae20/2021
    objet_marche = models.TextField(blank=False, null=False)
    date_marche = models.DateTimeField(auto_now_add=True)
    montant_marche = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.n_marche

    class Meta:
        ordering = ('-date_marche',)


class OperationService(models.Model):
    class Types(models.TextChoices):
        NOTIFICATION = ('N', 'Notification') 
        COMMENCEMENT = ('C', 'Commencement')
        ARRETE = ('A', 'Arrete')
        REPRISE = ('R', 'Reprise')

    n_marche = models.ForeignKey(Marche, on_delete=models.CASCADE, related_name='operation_services')
    n_os = models.IntegerField()
    date_os = models.DateTimeField(auto_now_add=True)
    type_os = models.CharField(max_length=1, choices=Types.choices)

    def __str__(self):
        return f"{self.n_marche}-{self.n_os}"

    class Meta:
        unique_together = (('n_marche', 'n_os'),)
        ordering = ('-date_os',)


class Decompte(models.Model):
    n_marche = models.ForeignKey(Marche, on_delete=models.CASCADE, related_name='decomptes')
    n_decompte = models.IntegerField()
    date_decompte = models.DateTimeField(auto_now_add=True)
    montant_decmopte = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.n_marche}-{self.n_decompte}"

    class Meta:
        unique_together = (('n_marche', 'n_decompte'),)
        ordering = ('-date_decompte',)
