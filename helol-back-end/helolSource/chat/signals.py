# region Imports
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from .models import ChatMessage
# endregion


# region Utility Functions
def send_channel_update(group):
    """
    Sends a WebSocket event to a specified group.

    :param group: The WebSocket group name.
    """
    channel_layer = get_channel_layer()
    if not channel_layer:  # avoid NoneType errors when ASGI isn't running
        return

    async_to_sync(channel_layer.group_send)(
        group,
        {
            "type": "send_update",
        }
    )
# endregion


@receiver(post_save, sender=ChatMessage)
def update_chat(instance, raw, **kwargs):
    """
    Signal to send a WebSocket update when a ChatMessage is saved.
    Skips execution when loading fixtures (raw=True).
    """
    if raw:  # skip when loaddata is running
        return

    user_id = instance.user_id
    group_name = f"chat_{user_id}"
    send_channel_update(group_name)
