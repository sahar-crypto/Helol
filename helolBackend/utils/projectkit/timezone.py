# region IMPORTS
import datetime
import pytz
# endregion


def convert_timezone(date_time: datetime, from_tz_str: str = "UTC", to_tz_str: str = "Africa/Cairo") -> datetime:
    """
    Convert a datetime from one timezone to another.

    :param date_time: The datetime object to be converted.
    :param from_tz_str: The timezone of the input datetime as a string.
    :param to_tz_str: The target timezone to convert to as a string.
    :return: A datetime object converted to the target timezone.
    """
    # Get the timezones
    from_tz = pytz.timezone(from_tz_str)
    to_tz = pytz.timezone(to_tz_str)

    # Check if the datetime is naive
    if date_time.tzinfo is None:
        # If naive, localize it to the 'from' timezone
        localized_time = from_tz.localize(date_time)
    else:
        # If already timezone-aware, use the existing timezone
        localized_time = date_time

    # Convert to the target timezone
    converted_time = localized_time.astimezone(to_tz)

    return converted_time
