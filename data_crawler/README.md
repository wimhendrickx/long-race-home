# Data crawler

SPOT Trackers send messages every 5 minutes to a SPOT server. These can be retrieved using the [SPOT
API](http://faq.findmespot.com/index.php?action=showEntry&data=69). The `TracksCrawler` class in
[`crawler.py`](./crawler.py) implements a few methods to fetch the SPOT messages. Next they are written to our CartoDB
table. The visualisations are updated automatically.

## Using the SPOT API

We are retrieving the data in json format. The HTTP request is sent using `requests` and parsing the json is straight
forward.

## Writing to CartoDB

We created 2 tables on CartoDB. One containing trackers metadata (rider name, tracker id, ...) and one containing the
actual tracking data (message id, rider name, date time, longitude, latitude, battery state, message type and battery
state).

## Periodically checking for new messages

The trackers send a new message every 5 minutes. Scheduling a job to ping for new messages is done using
[Celery](http://docs.celeryproject.org/en/latest/index.html) with a [Redis](http://redis.io/) backend. First, you'll 
need to install Redis and Celery and start the redis-server and the [`celery_app`](./celery_app.py) worker.
 
```
# refer to the documentation of the individual package for their installation instructions
redis-server
celery -A data_crawler.celery_app worker --loglevel=info
```

Next, configure the ping-interval in the [Celery configuration file](./celeryconfig.py]. It's currently set to 5 minutes
and it doesn't make sense to increase the frequency. You can also add `'kwargs': {'debug': True}` to the `new_messages`
task. This will generate random messages which is useful for testing your setup before the trackers are operating.

Start a Celery scheduler:

```
celery -A data_crawler.celery_app beat
```

If you have set `'debug'=True`, you should see output printed by the Celery worker. If you're not debugging anymore,
messages should be sent to the CartoDB table.