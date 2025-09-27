# region Imports
from django.db import models
from assets.models import *
from complaint.models import *
from mutagen import File as MutagenFile
from utils.voice.file import voice_message_upload_path
# endregion

class ChatMessage(models.Model):

    # Relationships
    session = models.ForeignKey(ComplaintSession, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    # Main Fields
    message = models.TextField()
    response = models.TextField(null=True, blank=True)
    audio_file = models.FileField(upload_to=voice_message_upload_path, null=True, blank=True)
    audio_duration = models.FloatField(null=True, blank=True)
    message_time = models.DateTimeField(auto_now_add=True)
    response_time = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # save first so file exists
        if self.audio_file and not self.audio_duration:
            try:
                audio = MutagenFile(self.audio_file.path)
                if audio and audio.info:
                    self.audio_duration = audio.info.length  # seconds (float)
                    super().save(update_fields=["audio_duration"])
            except Exception as e:
                print("Could not extract audio duration:", e)
