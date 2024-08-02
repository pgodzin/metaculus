# Generated by Django 5.0.6 on 2024-07-19 16:12

import pgvector.django.vector
from django.db import migrations
from pgvector.django import VectorExtension


class Migration(migrations.Migration):
    dependencies = [
        ("posts", "0017_post_published_at_triggered"),
    ]

    operations = [
        VectorExtension(),
        migrations.AddField(
            model_name="post",
            name="embedding_vector",
            field=pgvector.django.vector.VectorField(
                blank=True,
                help_text="Vector embeddings of the Post content",
                null=True,
            ),
        ),
    ]
