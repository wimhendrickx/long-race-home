from celery import Celery
from crawler import TracksCrawler

app = Celery('celery',
     broker='redis://localhost',
     backend='redis://localhost:6379/0')
app.config_from_object('data_crawler.celeryconfig')

@app.task
def new_messages(debug=False):
    crawler = TracksCrawler('cartodb api', debug=debug)
    result = crawler.fetch_new_messages()
    return result

if __name__ == '__main__':
    app.start()