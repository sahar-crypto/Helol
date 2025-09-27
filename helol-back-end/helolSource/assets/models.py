# region Imports
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from safedelete.models import SafeDeleteModel
from safedelete.managers import SafeDeleteManager
# endregion

# region Custom Base Models
class CustomUserManager(BaseUserManager, SafeDeleteManager):
    def create_user(self, full_name, national_id, password=None, **extra_fields):
        if not full_name:
            raise ValueError('Users must have an full name')
        if not national_id:
            raise ValueError('Users must have an national id')
        user = self.model(full_name=full_name, national_id=national_id, **extra_fields)
        if password:
            user.set_password(password)  # Hashes the password
        user.save(using=self._db)
        return user

    def create_superuser(self, full_name, national_id, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(full_name, national_id, password, **extra_fields)
# endregion

class Neighborhood(SafeDeleteModel):

    name = models.CharField(max_length=100)
    governorate = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=5)
    address = models.TextField(null=True)

    def __str__(self):
        return self.name

class User(AbstractBaseUser, PermissionsMixin, SafeDeleteModel):

    # Relationships
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.PROTECT, null=True)

    # Main Fields
    full_name = models.CharField(max_length=255, null=False, blank=False)
    national_id = models.CharField(max_length=14, unique=True, null=False, blank=False)
    email = models.EmailField(max_length=100, unique=True)
    phone = models.CharField(max_length=11)

    # Permissions fields (required for Django admin)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'national_id'
    REQUIRED_FIELDS = ["full_name"]

    # Identifying user manager
    objects = CustomUserManager()

    def __str__(self):
        return self.full_name

class GovernmentalAuthority(SafeDeleteModel):

    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    phone = models.CharField(max_length=11)
    address = models.TextField(null=True)

    def __str__(self):
        return self.name

class Service(SafeDeleteModel):

    # Relationships
    governmental_authority = models.ForeignKey(GovernmentalAuthority, on_delete=models.PROTECT)

    # Main Fields
    name = models.CharField(max_length=100)
    online = models.BooleanField(default=False)

    def __str__(self):
        return self.name