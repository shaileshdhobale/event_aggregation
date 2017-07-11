# event_aggregation

Application to search data from database for particular fields of Events collection like name, city, country and about.

# 3 REST APIs are there
1. Search text
2. Search text with limitation
3. API to upload places_1.csv (upload only same file)

One scheduler is there which will read the the uploads directory and read all the files and store the data of file in MongoDB.

Start the server using node bin/www




