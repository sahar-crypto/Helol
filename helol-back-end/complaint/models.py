# region Imports
from django.db import models
from assets.models import *
# endregion

class ComplaintSession(models.Model):

    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

class Complaint(models.Model):

    # Relationships
    session = models.OneToOneField(ComplaintSession, on_delete=models.PROTECT)
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    # Main Fields
    content = models.TextField()