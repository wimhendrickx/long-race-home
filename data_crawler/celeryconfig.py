from datetime import timedelta

CELERYBEAT_SCHEDULE = {
    'new_messages_every_60_seconds': {
        'task': 'data_crawler.celery_app.new_messages',
        'schedule': timedelta(minutes=5),
        'kwargs': {'debug': True}
    }
}