# region Imports
import os
from django.utils import timezone
# endregion

def voice_message_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1] or ".webm"
    user_id = instance.user.id if instance.user else "anon"
    ts = timezone.now().strftime("%Y%m%d%H%M%S")
    return f"voice_messages/{user_id}_{ts}{ext}"
