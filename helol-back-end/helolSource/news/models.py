# region Imports
from django.db import models
from assets.models import Neighborhood
# endregion

class NewsMessage(models.Model):

    # Relationships
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.PROTECT)

    # Main Fields
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True)



