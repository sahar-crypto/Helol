import json
import requests
from django.core.management.base import BaseCommand
from news.models import NewsMessage  # adjust app name if needed

API_URL = "http://helol-agent:3030/upsert"  # change if different


class Command(BaseCommand):
    help = "Upload all NewsMessage records to the /upsert API"

    def handle(self, *args, **options):
        self.stdout.write("Fetching NewsMessage records...")

        detail_records = []
        for msg in NewsMessage.objects.all():
            detail_records.append({
                "id": str(msg.id),
                "complaint_text": msg.content,
                "solution_text": msg.content,  # placeholder or real solution
                "category": "news"
            })

        if not detail_records:
            self.stdout.write(self.style.WARNING("No records found."))
            return

        payload = detail_records
        self.stdout.write(f"Uploading {len(detail_records)} records...")

        try:

            response = requests.post(API_URL, json=payload)

            if response.status_code == 200:
                data = response.json()
                self.stdout.write(self.style.SUCCESS(
                    f"✅ Upload successful: {data}"
                ))
            else:
                try:
                    error_detail = response.json()
                except json.JSONDecodeError:
                    error_detail = response.text

                self.stdout.write(self.style.ERROR(
                    f"❌ Upload failed with status {response.status_code}: {error_detail}"
                ))

        except requests.RequestException as e:
            self.stdout.write(self.style.ERROR(f"❌ Request error: {e}"))
