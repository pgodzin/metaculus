# Generated by Django 5.0.8 on 2024-08-27 14:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0006_projectsubscription_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="add_posts_to_main_feed",
            field=models.BooleanField(default=False),
        ),
    ]