from django.db import models


# Create your models here.
class Check_piont(models.Model):
    divice_num = models.IntegerField(default=0)
    postal_code = models.CharField(max_length=200)
    place_name = models.CharField(max_length=200)

    def __str__(self):
        return self.postal_code + ":" + self.place_name